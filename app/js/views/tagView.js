var jQuery = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Analytics = require('../lib/analytics');

module.exports = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, "change:isActive", this.onModelChangeActive);
    },
    events:  {
        'click': 'onClick'
    },
    className: 'iapp-filter-button',
    // template: templates['tag.html'],
    render: function(data) {
        this.$el.html(this.model.get('name'));    
        return this;
    },
    onClick: function() {
        Analytics.click('Filter clicked');
        //toggle active state of model when tag is clicked
        this.model.set({'isActive': !this.model.get('isActive')});

        if (!this.model.get('isActive')) {
            Backbone.trigger("clear:filter");
        }

    },
    onModelChangeActive: function() {
        if (this.model.get('isActive')) {
           this.$el.addClass('iapp-selected'); 
        } else {
            this.$el.removeClass('iapp-selected'); 
            // Backbone.trigger("clear:filter");
        }

    }
});
