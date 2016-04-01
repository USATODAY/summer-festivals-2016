var jQuery = require('jquery');
var _ = require('lodash');

var staticInfo = {};
var isMobile = false;
var isTablet = false;

module.exports =  _.extend({}, staticInfo, {
    isMobile: isMobile,
    isTablet: isTablet
});
