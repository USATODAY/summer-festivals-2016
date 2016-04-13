2016 Summer festivals interactive
============

# What this kit does
- processes SASS into CSS
- runs autoprefixer on CSS
- bundles JS files via Webpack/Babel
- generates static HTML from [Nunjucks templates](http://mozilla.github.io/nunjucks/)
- runs a dev server with live reload
- runs a build and deploys static files VIA FTP

# Getting Started

This kit is intended for use as part of USA TODAY's interactive-graphics rig, which holds multiple smaller graphics and uses this
template as a jumping off point. This can also be used as a stand-alone template.

## Initialize graphic
To initize graphic based on a graphic_template, run

```
npm run setup $TEMPLATE_NAME
```

If no `$TEMPLATE_NAME` is specified, graphics-kit will use the `base` template as a default. This will setup the project and install dependencies.

## Start running project locally
```
npm start
```

## Deploying
To deploy to USA TODAY's CDN, run
```
npm run deploy
```

This will build production ready files and upload them. USAT's credentials must be stored as environment variables.

Required credentials:

Key           | Value
------------- | ---------------
USAT_FTP_USER | FTP Username
USAT_FTP_PASS | FTP password

## Analytics

To track events and page views on USA TODAY's Omniture account, require the analytics library
```javascript
var Analytics = require('./lib/analytics');
```
Make sure analytics are initialized once with slug as namespace parameter
```javascript
Analytics.setup(config.graphic_slug);
```

Subsequently track page views and events with

```javascript
Analytics.click($EVENT_NAME)
Analytics.pageView($EVENT_NAME)
```

## Updating project data
Set up a Python virtual environment, install python dependencies with 
```
pip install -r requirements.txt
```

Download a copy of the spreadsheet from Google Sheets as an .xlxs file, and rename to data.xlsx and save in the data_tools/src directory.

Then run 

```
python data_tools/formatdata.py
```

This will convert the file into usable json at data_tools/output/data.json. Copy this file into app/data and you're good to go.
