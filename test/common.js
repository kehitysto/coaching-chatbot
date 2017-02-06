/**
* Common test fixture for all test cases
*/

global.chai = require('chai');
global.expect = require('chai').expect;

const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

require('source-map-support').install({
    handleUncaughtExceptions: false,
    environment: 'node',
});
