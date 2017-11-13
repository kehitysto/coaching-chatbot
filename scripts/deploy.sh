#!/bin/bash
STAGE=$1

if [ $TRAVIS_BRANCH = "master" ]
then
  export FACEBOOK_PAGE_ACCESS_TOKEN=$PRODUCTION_PAGE_ACCESS_TOKEN
fi

npm run write-env
npm i -g serverless

serverless deploy --stage=$STAGE
