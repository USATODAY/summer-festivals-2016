var jQuery = require('jquery');
var _ = require('lodash');

var staticInfo = {};
var isMobile = false;
var isTablet = false;

if (window.innerWidth < 540 || Modernizr.touch) {
    isMobile = true;
}

module.exports =  _.extend({}, staticInfo, {
    isMobile: isMobile,
    isTablet: isTablet
});
