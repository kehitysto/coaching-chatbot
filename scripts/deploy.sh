#!/bin/bash
STAGE=$1

npm run write-env
npm i -g serverless

serverless deploy --stage=$STAGE
