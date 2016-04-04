var jQuery = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');


var hostname = window.location.hostname;

var dataURL = 'data/data.json';


module.exports =  {
    data: {},
    getData: function() {
        var _this = this;
        jQuery.getJSON(dataURL, function(data) {        
            _this.data = _this.cleanSearchNames(data);
            _this.data.festivals = [{
                'name': 'All bands',
                'tagName': 'all'
            }].concat(_this.data.festivals);
            console.log(data);
            Backbone.trigger("data:ready", this);
        });
    },

    cleanSearchNames: function(data) {
        var _this = this;
        var returnArtists = _.map(data.artists, function(artist) {
            var normalizedName = _this._normalizeName(artist.artist);
            return _.extend(artist, {
                searchName: normalizedName
            });
        });

        data.artists = returnArtists;

        return data;
    },

    _normalizeName: function(name) {
        var noSpaces = name.toLowerCase().trim().replace(/\s+/g, "_");
        var noAmpersands = noSpaces.replace(/&+/g, "and");
        var noPunctuation = noAmpersands.replace(/[\.,-\/#!$%\^&\*;:{}=\-`~()]/g,"");
        return noPunctuation.toString();
    },
    
    cleanTag: function(tagName) {
        return tagName.replace(/\n+/g, "-").toLowerCase();
    },
    userName: '',
    base_url: 'http://www.gannett-cdn.com/experiments/usatoday/2015/04/festivals/img/'
};
