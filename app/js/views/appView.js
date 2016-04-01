var jQuery = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Analytics = require('../lib/analytics');
var config = require('../models/config');
var MenuModel = require('../models/menuModel');
var ShareModel = require('../models/shareModel');
var DetailView = require('../views/detailView');
var CardsView = require('../views/cardsView');
var MenuView = require('../views/menuView');
var ShareView = require('../views/shareView');
var ItemsCollection = require('../collections/ItemsCollection');
var router = require('../router');
var dataManager = require('../dataManager');

module.exports = Backbone.View.extend({
el: ".graphic-content",
events: {
  'click .iapp-begin-button': 'onBeginClick',
  'click .iapp-fest-info-previous': 'onPrevious',
  'click .iapp-fest-info-next': 'onNext',
  'click .iapp-search-button': 'searchText',
  'keypress #iapp-search-input': 'onSearchKeypress'
},

initialize: function() {
  this.listenTo(Backbone, 'route:last-week', this.onRouteLastWeek);
  this.listenTo(Backbone, 'route:share', this.onRouteShare);
  this.listenTo(Backbone, 'data:ready', this.onDataReady);
  this.listenTo(Backbone, 'app:reset', this.onAppReset);
  this.listenTo(Backbone, 'set:filter', this.onSetFilter);
  this.listenTo(Backbone, 'clear:filter', this.onClearFilter);
},


template: require("../templates/app-view.tmpl.html"),

festInfoTemplate: require("../templates/fest-info.tmpl.html"),
searchTemplate: require("../templates/search.tmpl.html"),

render: function() {
  this.$el.html(this.template({
      chatter: "Music fills the hot summer air at festivals across the USA. We compiled lineups from the most popular mega-music events. This page shows all the acts, starting with the most popular — click on one to see where that band or musician is playing. Then click on any of the festival names to see the lineup for that event. Rock on!", 
      header: "USA TODAY Summer Music Festivalaganza", 
      contact_email: ""
  }));
  this.$('.iapp-festival-info-wrap').html(this.searchTemplate());
  
},

addSubViews: function() {
  this.menuView = new MenuView({model: new MenuModel()});
  this.itemsCollection = new ItemsCollection(dataManager.data.artists); 
  this.cardsView = new CardsView({collection: this.itemsCollection});
  Backbone.history.start();
},

onDataReady: function() {
  this.render();
  this.addSubViews();
},

onMenuClick: function() {
  Backbone.trigger('menu:show');
},

onNext: function() {
    Backbone.trigger('festival:next');
},

onPrevious: function() {
    Backbone.trigger('festival:previous');
},

onSetFilter: function(activeFestival) {
    showPrevious = activeFestival.getIndex() > 0;
    if (showPrevious) {
        console.log("show previous");
    }
    showNext = activeFestival.getIndex() < activeFestival.collection.length - 1;
    this.$(".iapp-festival-info-wrap").html(this.festInfoTemplate({'festival': activeFestival.toJSON(), 'showPrevious': showPrevious, 'showNext': showNext}));
},

onClearFilter: function() {
    this.$('.iapp-festival-info-wrap').html(this.searchTemplate());
},

onRouteShare: function() {
  this.$el.addClass('iapp-share-route');
},

onAppReset: function() {
  this.$el.removeClass('iapp-last-week-route');
  this.$('.iapp-last-week-radio').eq(1).prop('checked', false);
  this.$('.iapp-last-week-radio').eq(0).prop('checked', true);
},

onBeginClick: function() {
    console.log('begin');
    Analytics.trackEvent('Begin button clicked');
    this.$('.iapp-begin-button').addClass('iapp-transition-out');
    this.$('.iapp-intro-wrap').fadeOut();
},

onRouteLastWeek: function() {
    Analytics.trackEvent('Last week guests page viewed');
    this.$el.addClass('iapp-last-week-route');
    this.menuView.model.set({'isMenuOpen': false});
    this.$('.iapp-last-week-radio').eq(1).prop('checked', true);
    this.$('.iapp-last-week-radio').eq(0).prop('checked', false);
},

onSearchKeypress: function(e) {
    var _this = this;
    if (e.which == 13) {
        _this.searchText();
    }
},

searchText: function() {
    var searchText = this.$('#iapp-search-input').val();
    Backbone.trigger("search", this._normalizeName(searchText));
},
_normalizeName: dataManager._normalizeName,
});

