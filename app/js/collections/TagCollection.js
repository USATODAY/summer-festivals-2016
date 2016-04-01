var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var TagModel = require('../models/TagModel');

module.exports = Backbone.Collection.extend({
    model: TagModel,
    initialize: function() {
        this.listenTo(Backbone, "set:filter", this.onFilterSet);
        this.listenTo(Backbone, "clear:filter", this.onClear);
        this.listenTo(Backbone, 'tags:reset', this.onTagsReset);
        this.listenTo(Backbone, 'route:filters', this.onFilterRoute);
        this.listenTo(Backbone, 'app:reset', this.onAppReset);
        this.listenTo(Backbone, 'festival:next', this.goToNext);
        this.listenTo(Backbone, 'festival:previous', this.goToPrevious);
    },

    _currentFilter: null,

    _currentIndex: null,

    onFilterSet: function(activeFilter) {


        //set old filter to not active
        if (this._currentFilter !== null) {
            this._currentFilter.set({'isActive': false});
        }

        this._currentIndex = this.indexOf(activeFilter);

        this._currentFilter = activeFilter;
        var filterSlug = activeFilter.get('tagName');

        router.navigate('festival/' + filterSlug);
        Backbone.trigger('filters:update', activeFilter);
    },

    goToNext: function() {
        nextFilter = this.at(this._currentIndex + 1);
        nextFilter.set({'isActive': true});
    },

    goToPrevious: function() {
        previousFilter = this.at(this._currentIndex - 1);
        previousFilter.set({'isActive': true});
    },

    onClear: function() {
        router.navigate('_');
        this._currentFilter = null;
    },

    onTagsReset: function() {
        this.each(function(tag) {
            tag.set({'isActive': false}); 
        });

    },
    onFilterRoute: function(filterName) {
        var _this = this; 

         _this.findWhere({'tagName': filterName}).set({'isActive': true});
    },
    onAppReset: function() {
        this.onTagsReset();
    }
});
