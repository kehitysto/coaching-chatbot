#!/bin/bash
STAGE=$1

npm run write-env
npm i -g serverless

if [ $TRAVIS_BRANCH = "feature/add-production-deployment" ]
then
  echo 'JEEEEEI'
  if [ -z ${PRODUCTION_PAGE_ACCESS_TOKEN+x} ]; then echo "var is unset"; else echo "var is set to '$PRODUCTION_PAGE_ACCESS_TOKEN'"; fi
fi
serverless deploy --stage=$STAGE
