var jQuery = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Analytics = require('../lib/analytics');
var TagView = require('../views/TagView');
var config = require('../models/config');
var dataManager = require('../dataManager');

module.exports = Backbone.View.extend({
    initialize: function() {
       this.listenTo(Backbone, 'tags:filter-ready', this.throttledFilter);
       this.listenTo(Backbone, 'video:set', this.advanceSub);
       this.listenTo(Backbone, 'tags:reset', this.onTagsReset);
       this.listenTo(Backbone, 'app:reset', this.onReset);
       
       this.render();
    },
    events: {
        'click .iapp-filter-button-clear': 'onClear'
    },
    el: '.iapp-filters-wrap',
    
    
    render: function() {

        

        var _this = this;
        // this.$el.html(this.template({tag_text: dataManager.data.tag_text, greeting: this.getGreeting()}));
        
        this.collection.each(function(tagModel) {
             var tagView = new TagView({model: tagModel});
             _this.$el.append(tagView.render().el);
        });

        // _.defer(function() {
        //         
        //         _this.$el.isotope({
        //             itemSelector: '.iapp-filter-button',
        //             transitionDuration:  0,
        //             layoutMode: 'fitRows'
        //
        //     });
        // });

        this.$el.append('<div class="iapp-filter-button iapp-filter-button-clear">Show All</div>');
        
        return this;
    },
    
    onClear: function() {

        _.each(this.collection.where({'isActive': true}), function(tagModel) {
            tagModel.set({'isActive': false});
        });

        Backbone.trigger("clear:filter");
    }
});
