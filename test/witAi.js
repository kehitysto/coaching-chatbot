'use strict';

require('dotenv').config();


const mochaPlugin = require('serverless-mocha-plugin');
const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;


describe('sample test case', () => {
    it('makes sure 1 = 1', () => {
        expect(1).to.equal(1);
    });
});
