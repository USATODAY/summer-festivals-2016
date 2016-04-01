var jQuery = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Analytics = require('../lib/analytics');
var config = require('../models/config');

module.exports = Backbone.View.extend({
  tagName: "div",

  initialize: function() {
  },

  attributes: function() {
  
      return {
        "data-search-name": this.model.get("searchName")
      }
  },

  className: function() {
    var tags = this.model.get("festivals");
    var classes = "card small-card";
    _.each(tags, function(tag) {
      var tagClass = tag.tag_name;
      
      classes += (" " + tagClass);
    });
    return classes;
  },

  events: {
    "click": "setHighlight",
    'click .iapp-like-button': 'onLikeClick',
    'click .iapp-dislike-button': 'onDislikeClick'
  },

  template: require("../templates/card-front.tmpl.html"),

  render: function() {
    var blnMobile = config.isMobile || config.isTablet;
    this.$el.attr('data-appearances', this.model.get('filteredAppearancesTotal'));
    this.$el.html(this.template({artist: this.model.toJSON(), mobile: blnMobile}));

    return this;
  },

  setHighlight: function() {
    Analytics.trackEvent("opened card");
    this.model.set({
      "highlight": true
    });
  }

});
