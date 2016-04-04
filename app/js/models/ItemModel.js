var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
module.exports = Backbone.Model.extend({
    defaults: {
        highlight: false,
        top: 0,
        festivals: []
    },
    initialize: function() {
        this.set({'genre': this.get('genre')});
    },
    onFiltersUpdate: function(filterArray) {
        var _this = this;
        // _.defer(function() {
            // _this.filterAppearancesByNetwork(networkArray, categoryArray);
        // });
    },

    filterAppearancesByNetwork: function(networkArray) {
        var totalAppearances = this.get('appearances');
        var filteredAppearances = totalAppearances;
        if (networkArray.length > 0) {
            filteredAppearances = _.filter(filteredAppearances, function(appearance) {
                if (appearance.network !== undefined) {
                    return _.contains(networkArray, appearance.network.toLowerCase());
                } else {
                    return false;
                }
            });
                        }
        if (categoryArray.length > 0) {
            filteredAppearances = _.filter(filteredAppearances, function(appearance) {
                return _.contains(categoryArray, appearance.category.toLowerCase());
            });
        }
        
        this.set({'filteredApperances': filteredAppearances});
        this.set({'filteredAppearancesTotal': filteredAppearances.length});


    }

});
