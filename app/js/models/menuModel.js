var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var config = require('./config');

module.exports = Backbone.Model.extend( {
    defaults: {
        isMenuOpen: false,
        numlikes: 0,
        numdislikes: 0
    },

    initialize: function() {
        if (config.isMobile || window.innerWidth < this.mobileThreshhold) {
            this.set({
                'isMenuOpen': false
            });
        }
        this.on('change', this.onChange);
        this.listenTo(Backbone, 'window:resize', this.onResize);
        this.listenTo(Backbone, 'liked:update', this.onLikeUpdate);
        this.listenTo(Backbone, 'disliked:update', this.onDislikeUpdate);
        // this.listenTo(Backbone, 'app:reset', this.onAppReset);
    },
    onChange: function() {
        if (this.get('isMenuOpen')) {
            Backbone.trigger('menu:show');
        } else {
             Backbone.trigger('menu:hide');
        }
    },
    onResize: _.throttle(function(e) {
        if (window.innerWidth < this.mobileThreshhold) {
            this.set({isMenuOpen: false});
        } 
    }, 500),

    onDislikeUpdate: function(dislikeArray) {
        var numDislikes = dislikeArray.length;
        this.set({'numdislikes': numDislikes});
    },

    onLikeUpdate: function(likeArray) {
        var numLikes = likeArray.length;
        this.set({'numlikes': numLikes});
    },
    onAppReset: function() {
        if (!config.isMobile && window.innerWidth >= this.mobileThreshhold) {
            this.set({'isMenuOpen': true});
        }
    },
    

    mobileThreshhold: 1000
});
