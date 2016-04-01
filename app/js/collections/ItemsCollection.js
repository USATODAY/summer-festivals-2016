var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var ItemModel = require('../models/ItemModel');

module.exports = Backbone.Collection.extend({

  initialize: function() {

    // this.listenTo(Backbone, "filters:update", this.onFilterUpdate);
    this.listenTo(Backbone, 'app:reset', this.onResetApp);
  },

  // Reference to this collection's model.
  model: ItemModel,

  onFilterUpdate: function(filterArray) {
       this.filterByTagArray(filterArray);
       // var availableTags = this.getAvailableTags();
       Backbone.trigger("items:filtered", this._availableTags);
  },

  arrContains: function(array1, array2) {
      var diff = _.difference(array1, array2);
      if (diff.length === 0) {
          return true;
      } else {
          return false;
      }
  },


  filterByTagArray: function(filterArray) {
       _this = this;
       availableTags = [];
        this.each(function(model) {
            var modelTags = _.map(model.get('festivals'), function(festival_obj) {
                return festival_obj.tag_name;
            });
            var isAvailable = _this.arrContains(filterArray, modelTags);

            if (isAvailable) {
                availableTags = availableTags.concat(modelTags);
                model.set({'isAvailable': true});
            } else {
                model.set({'isAvailable': false});
            }
        });


        //cache a copy of filtered items
        this._availableItems = this.where({'isAvailable': true});

        //cache copy of available tags
        this._availableTags = _.uniq(availableTags);
        // console.log(this._availableItems);

    },
    getAvailableTags: function() {
        availableTags = [];

        _.each(this._availableItems, function(model) {
            availableTags = _.union(availableTags, model.get('festivals'));
        });
        return availableTags;
    },
    onResetApp: function() {
      this.each(function(model) {
        model.set({'highlight': false});
      });
    }



});
