#!/bin/sh

BASEDIR=$(dirname $0)
echo =======================
echo USA TODAY GRAPHICS KIT
echo =======================
SLUG=${PWD##*/}

# move appropriate template to ./app
if (("$#" > 0)); then
    TEMPLATE_NAME=$1
    TEMPLATE_DIR="graphic_templates/$TEMPLATE_NAME"
    if [ -d "$TEMPLATE_DIR" ]; then
        echo "| \n|\n"
        echo "STARTING FROM TEMPLATE: $TEMPLATE_NAME"
        echo "| \n|\n"
        mv "$TEMPLATE_DIR" ./app
    else
        echo "| \n|\n"
        echo "No template by that name try one of these: "
        ls graphic_templates
        exit 0
    fi
else
    echo "| \n|\n"
    echo "STARTING FROM TEMPLATE: base"
    echo "| \n|\n"
    mv graphic_templates/base ./app
fi

# set up graphic config and package.json based on folder name as slug
node bin/configure.js

#re-install dependencies after package.json has been updated
echo install template dependencies
npm install

rm app/template-dependencies.json


if [ -d "../.git" ]; then
    # remove .git folder
    rm -rf .git
else
    rm -rf .git
    git init
fi


rm -rf graphic_templates
# commit new graphic
git add .
git commit -m "add new graphic $SLUG"
