var jQuery = window.jQuery = require('jQuery');
var Analytics = require('./lib/analytics');
var config = require('../data/graphic_config.yml');
var _ = require('lodash');
var Backbone = require('backbone');
var AppView = require('./views/appView');
var dataManager = require('./dataManager');
var Isotope = require('isotope-layout');
var imagesLoaded = require('imagesLoaded');

var graphicEl;

function onReady() {
    var isEmbed = window != window.parent;
    var analyticsEmbed = isEmbed ? 'true' : '';
    graphicEl = document.getElementById('graphic-wrapper');
    Analytics.setup(config.graphic_slug, {'embedded': analyticsEmbed});
    var events = _.extend({}, Backbone.Events);

    window.addEventListener('resize', function(e) {
        Backbone.trigger('window:resize');
        setHeight();
    });

    jQuery(window).on('scroll', function() {
        Backbone.trigger('window:scroll');
    });

    events.listenTo(Backbone, 'setHeight', setHeight);

    if (!Backbone.History.started) {

        //Make data request
        dataManager.getData();

        //Create app view
        AppView = new AppView();

    }

}

function setHeight() {
    
    imagesLoaded(graphicEl, function(instance) {
        let newHeight = graphicEl.clientHeight + 15;
        if (!window.initialHeight) {
            window.initialHeight = newHeight;
        }
        parent.postMessage({
            height: newHeight, 
            target: config['graphic_slug']
        }, '*');
    });
}

document.addEventListener('DOMContentLoaded', onReady);
