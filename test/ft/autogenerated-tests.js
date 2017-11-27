import * as discussions from '../../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../../doc/flow/states.json';
import * as DiscussionGenerator from '../generate-discussions';
import { keccak512 } from 'js-sha3'

describe('Automatically generated feature test', function() {
  describe('As a user I want the chatbot to work correctly', function () {
    it('should match with the given hash sum', function() {
      this.timeout(10000);
      return expect(DiscussionGenerator.generate(discussions, states)
        .then(lines => keccak512(lines.join()))).to.eventually.equal('8872249f6babdbe46be04ebc841e6a94b605a3c5942fa9e1a52d2c669dc78b15c321f74680176c9ea05d2300b9aa89af4484f84e07d9710d2e3eb103ccfe34e0');
    });
  });
});