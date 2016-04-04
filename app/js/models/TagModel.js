var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');

module.exports = Backbone.Model.extend( {
    defaults: {
        'tagName': '',
        'isAvailable': true,
        'isActive': false,
        'index': null
    },

    initialize: function() {
        this.on("change:isActive", this.onChange);
    },

    onChange: function() {
        if (this.get('isActive')) {
            Backbone.trigger('set:filter', this);
        }
    },

    getIndex: function() {
        var index = this.collection.indexOf(this);
        return index;
    }
});
