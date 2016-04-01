  // Questions Collection
  // ---------------

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var ItemModel = require('../models/ItemModel');
    
// The collection of questions is backed by json file
module.exports = Backbone.Collection.extend({

  // Reference to this collection's model.
  model: ItemModel,

});

