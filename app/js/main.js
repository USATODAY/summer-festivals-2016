var jQuery = window.jQuery = require('jQuery');
var Analytics = require('./lib/analytics');
var config = require('../data/graphic_config.yml');

var graphicEl;

function onReady() {
    var isEmbed = window != window.parent;
    var analyticsEmbed = isEmbed ? 'true' : '';
    graphicEl = document.getElementById('graphic-wrapper');
    Analytics.setup(config.graphic_slug, {'embedded': analyticsEmbed});
}

function setHeight() {
    var newHeight = graphicEl.offsetHeight + 15;
    parent.postMessage({height: newHeight, target: config['graphic_slug']}, '*');
}

document.addEventListener('DOMContentLoaded', onReady);
