var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Isotope = require('isotope-layout');
var imagesLoaded= require('imagesLoaded');
var Analytics = require('../lib/analytics');
var config = require('../models/config');
var detailView = require('../views/detailView');
var cardView = require('../views/cardView');
var router = require('../router');

module.exports = Backbone.View.extend({
el: ".iapp-card-wrap",

events: {

},

initialize: function() {
  this.$noResultsMessage = $('.no-results-wrap');
  this.listenTo(this.collection, 'change:highlight', this.showDetail);
  this.listenTo(router, "highlight", this.onHighlightRoute);
  this.listenTo(router, "homeRoute", this.onHomeRoute);
  this.listenTo(Backbone, "filters:update", this.filter);
  this.listenTo(Backbone, "clear:filter", this.clearFilters);
  this.listenTo(Backbone, 'route:share', this.onRouteShare);
  this.listenTo(Backbone, 'app:reset', this.onAppReset);
  this.listenTo(Backbone, 'search', this.searchByName);
  this.render();

},

addOne: function(question) {
  var view = new cardView({model: question});
  this.$el.append(view.render().el);
},

showDetail: function(model) {
  if(model.get('highlight')) {
    this.detailView =  new detailView({model: model});
    this.$el.append(this.detailView.render().el);
  }
  
},


render: function() {
  // this.$el.empty();
  this.collection.each(this.addOne, this);
  // this.$el.addClass('iapp-card-wrap-full-width');
  
  var $el = this.$el;
  var _this = this;
  this.isotope = new Isotope(_this.el, {
      itemSelector: '.card',
      transitionDuration: (!config.isMobile) ? '0' : 0,
      getSortData: {
        appearances: function(itemElem) {
          return parseInt(jQuery(itemElem).data('appearances'));
        }
      },
      sortBy: 'appearances',
      sortAscending: false
  });
  // $el.isotope( {
  //     itemSelector: '.card',
  //     transitionDuration: (!config.isMobile) ? '0' : 0,
  //     getSortData: {
  //       appearances: function(itemElem) {
  //         return parseInt(jQuery(itemElem).data('appearances'));
  //       }
  //     },
  //     sortBy: 'appearances',
  //     sortAscending: false
  //   });
  
  imagesLoaded(this.el, function() {
    _this.relayout();

  });
},

unveilImages: function() {

  var _this = this;

  this.$('.cover-img').unveil(5000, function() {
    $(this).imagesLoaded(function() {
      _this.relayout();
    });
  });
}, 


filter: function(activeFilter) {
    var filterStr = "." + activeFilter.get('tagName');
    this.isotope.arrange({ filter: filterStr });
    this.$noResultsMessage.hide();
    Backbone.trigger('setHeight');
    _.delay(function() {
      $(window).trigger('scroll');
    }, 1000);

    _.delay(function() {
      $(window).trigger('scroll');
    }, 2000);
},

searchByName: function(name) {
    this.isotope.arrange({
        filter: function() {
            var itemName = $(this).data("search-name").toString();
            return itemName.indexOf(name) > -1;
        }
    });
    var numResults = this.isotope.filteredItems.length;
    if (numResults == 0) {
        // this.$el.append(this.noResultsMessage());
        this.$noResultsMessage.show();
        this.$el.css('height', 'auto');
    } else {
        this.$noResultsMessage.hide();
    }
},

relayout: _.throttle(function() {
  this.isotope.layout();
  _.delay(function() {
      $(window).trigger('scroll');
      Backbone.trigger('setHeight');
    }, 1000);
}, 500),

clearFilters: function(e) {
  this.isotope.arrange({ filter: "*"});
  this.$noResultsMessage.hide();
  Backbone.trigger('setHeight');
},

onRouteShare: function() {
  var _this = this;
  _.defer(function() {
    _this.isotope.arrange({filter: '.iapp-liked, .iapp-disliked'});
    _this.isotope.updateSortData();
    _this.isotope.arrange({sortBy: 'liked'});
  });
},

onAppReset: function() {
  this.clearFilters();
  this.relayout();
}
});

