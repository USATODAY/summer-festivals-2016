var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Router = Backbone.Router.extend({

  routes: {
    "": "home",
    "_": "home",
    "native": "native",
    'festival/:filterStr': 'filters'
    
  },

  home: function() {
    Backbone.trigger('app:reset');
  },

  native: function() {
    $('header').hide();
    $('body').addClass('in-app')

  },

  filters: function(filterStr) {
    var filterArray = filterStr.split('-');
    Backbone.trigger('route:filters', filterStr);
  }

});

_.extend(Router, Backbone.Events);

module.exports = new Router();
