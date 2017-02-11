#!/bin/bash
STAGE=$1

npm run write-env
npm i -g serverless@1.5.1

serverless deploy --stage=$STAGE
