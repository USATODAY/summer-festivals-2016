var jQuery = window.jQuery = require('jQuery');
var Analytics = require('./lib/analytics');
var config = require('../data/graphic_config.yml');
var Backbone = require('backbone');
var AppView = require('./views/appView');
var dataManager = require('./dataManager');
var Isotope = require('isotope-layout');

var graphicEl;

function onReady() {
    var isEmbed = window != window.parent;
    var analyticsEmbed = isEmbed ? 'true' : '';
    graphicEl = document.getElementById('graphic-wrapper');
    Analytics.setup(config.graphic_slug, {'embedded': analyticsEmbed});

    window.addEventListener('resize', function(e) {
        Backbone.trigger('window:resize');
    });

    jQuery(window).on('scroll', function() {
        Backbone.trigger('window:scroll');
    });

    if (!Backbone.History.started) {

        //Make data request

        dataManager.getData();

        //Create app view
        AppView = new AppView();

    }

}

function setHeight() {
    var newHeight = graphicEl.offsetHeight + 15;
    parent.postMessage({height: newHeight, target: config['graphic_slug']}, '*');
}

document.addEventListener('DOMContentLoaded', onReady);
