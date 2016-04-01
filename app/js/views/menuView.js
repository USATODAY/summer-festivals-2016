var jQuery = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Analytics = require('../lib/analytics');
var config = require('../models/config');
var ShareModel = require('../models/shareModel');
var TagsView = require('../views/tagsView');
var ShareView = require('../views/shareView');
var TagCollection = require('../collections/TagCollection');
var router = require('../router');
var dataManager = require('../dataManager');

module.exports = Backbone.View.extend({
    el: '.iapp-menu',
    template: require('../templates/menu.tmpl.html'),
    events: {
        'click .iapp-menu-close': 'onCloseClick',
        "click .iapp-menu-button": "onMenuClick",
        'click .iapp-reset-button': 'onResetClick'
    },
    initialize: function() {

        this.listenTo(Backbone, "set:filter", this.onSetFilter);
        this.listenTo(this.model, 'change:isMenuOpen', this.updateState);
        this.render();
    },
    render: function() {
        
        this.updateState();
        this.$el.html(this.template(this.model.toJSON()));
        this.addSubViews();
        return this;
    },
    addSubViews: function() {
        this.tagsCollection = new TagCollection(dataManager.data.festivals);
        this.tagsView = new TagsView({collection: this.tagsCollection});
        
    },
    onSetFilter: function(activeFestival) {
        this.showPrevious = activeFestival.getIndex() > 0;
        this.showNext = activeFestival.getIndex() < activeFestival.collection.length - 1;
        if (this.showPrevious) {
            this.$(".iapp-menu-control-area").addClass("show-previous");
        } else {
            this.$(".iapp-menu-control-area").removeClass("show-previous");
        }
        if (this.showNext) {
            this.$(".iapp-menu-control-area").addClass("show-next");
        } else {
            this.$(".iapp-menu-control-area").removeClass("show-next");
        }
    },
    updateState: function() {
        if (this.model.get('isMenuOpen')) {
            this.$el.addClass('iapp-menu-show').removeClass('iapp-menu-hide');
        } else {
            this.$el.addClass('iapp-menu-hide').removeClass('iapp-menu-show');
        }
    },
    onCloseClick: function() {
        Analytics.trackEvent("Close menu button clicked");
        this.model.set({isMenuOpen: false});
        // $('body,html').removeClass('iapp-no-scroll');
    },
    onMenuClick: function() {
        Analytics.trackEvent("Open menu button clicked");
        this.model.set({isMenuOpen: true});
        if (window.innerWidth < this.model.mobileThreshhold) {
             // $('body,html').addClass('iapp-no-scroll');
        }
    },
    onLikeChange: function() {
        var numLikes = this.model.get('numlikes');
        this.$('.iapp-menu-scoreboard-likes').find('.iapp-menu-scoreboard-score-number').text(numLikes);
    },
    onDislikeChange: function() {
        var numDislikes = this.model.get('numdislikes');
        this.$('.iapp-menu-scoreboard-dislikes').find('.iapp-menu-scoreboard-score-number').text(numDislikes);
    },
    
    onResetClick: function() {
        Backbone.trigger('app:reset');
        router.navigate('_');
    }

});
