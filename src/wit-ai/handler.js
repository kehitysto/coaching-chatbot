'use strict';

require('../lib/envVars').config();

module.exports.handler = (event, context, cb) => {
  if (!process.env.WIT_AI_TOKEN) {
    return cb('No WIT_AI_TOKEN defined');
  }
  return cb('No SNS event');
};
