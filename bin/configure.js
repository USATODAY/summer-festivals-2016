#!/usr/bin/env node
var fs = require('fs');
var YAML = require('yamljs');
var _ = require('lodash');
var npm_package = require('../package.json');
var template_dependencies;
try {
    template_dependencies = require('../app/template-dependencies.json');
} catch(e) {
    template_dependencies = {};
}

var pathArray = __dirname.split('/');
var slug = pathArray[pathArray.length - 2];

var configString = fs.readFileSync(__dirname + '/../app/data/graphic_config.yml', 'utf8');
var graphic_config = YAML.parse(configString);

graphic_config.graphic_slug = slug;
graphic_config.asset_path = graphic_config.asset_path + slug + '/'

if (!npm_package.config) {
    npm_package.config = {};
};

npm_package.config.graphic_slug = slug;

//add template-dependencies to package.json
npm_package.dependencies = _.assign({}, npm_package.dependencies, template_dependencies);

fs.writeFile(__dirname + '/../app/data/graphic_config.yml', YAML.stringify(graphic_config, 4), function(err) {
    if(err) {
        return console.log(err);
    }
});

fs.writeFile(__dirname + '/../package.json', JSON.stringify(npm_package), function(err) {
    if(err) {
        return console.log(err);
    }
    else {
        return console.log("New graphic: " + slug);
    }
});
