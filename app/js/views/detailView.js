var jQuery = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Analytics = require('../lib/analytics');
var config = require('../models/config');
var router = require('../router');
var dataManager = require('../dataManager');
var detailTemplate = require('../templates/card-back.tmpl.html');

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "iapp-modal",
    template: detailTemplate,

    events: {
      "click .close-card": "removeHighlight",
      "click .facebook-share": "facebookShare",
      "click .twitter-share": "twitterShare",
      "click .iapp-detail-bg": "removeHighlight",
      'click .iapp-like-button': 'onLikeClick',
      'click .iapp-dislike-button': 'onDislikeClick' 
    },

    initialize: function() {

      // router.navigate("movie/" + this.model.get("rowNumber"));
      this.listenTo(Backbone, "highlight:remove", this.removeHighlight);
      this.listenTo(this.model, 'change:isLiked', this.onLikeChange);
      this.listenTo(this.model, 'change:isDisliked', this.onDislikeChange);
      this.listenTo(this.model, 'change:highlight', this.removeCard);
    },
    render: function() {
      this.$el.empty();
      $('body').addClass('iapp-no-scroll');

      if (this.model.get('isLiked')) {
        this.$el.addClass('iapp-liked');
      } else if (this.model.get('isDisliked')) {
        this.$el.addClass('iapp-disliked');
      }

      
      this.$el.html(this.template({'artist': this.model.toJSON(), 'festivals': dataManager.data.festivals}));   
      this.postRender(this.$el);
      return this;
    },

    postRender: function(element) {

      _.defer(function() {

        element.addClass("modal-show");
      }, element);
        
    },

    removeCard: function(model) {

        if(!model.get('highlight')) {
        
            $('body').removeClass('iapp-no-scroll');
          
            
            this.$el.removeClass("modal-show");
            var _this = this;
            
            _.delay(function() {
              _this.remove();
            }, 500);
        
        }
       
    
      
    },


    removeHighlight: function() {
      this.model.set({"highlight": false});
    },

    onLikeClick: function() {
      this.model.undislike();
        if (!this.model.get('isLiked')) {
          this.model.like();
        } else {
          this.model.unlike();
        }
        
    },

    onDislikeClick: function() {
      this.model.unlike();

        if (!this.model.get('isDisliked')) {
          this.model.dislike();
        } else {
          this.model.undislike();
        }
    },

    onLikeChange: function() {
      if (this.model.get('isLiked')) {
        this.$el.addClass('iapp-liked');
      } else {
        this.$el.removeClass('iapp-liked');
      }
    },
    onDislikeChange: function() {
      if (this.model.get('isDisliked')) {
        this.$el.addClass('iapp-disliked');
      } else {
        this.$el.removeClass('iapp-disliked');
      }
    }

});
