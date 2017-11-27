import * as discussions from '../../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../../doc/flow/states.json';
import * as DiscussionGenerator from '../generate-discussions';
import { keccak512 } from 'js-sha3'

describe('Automatically generated feature test', function() {
  describe('As a user I want the chatbot to work correctly', function() {
    it('should match with the given hash sum', function() {
      this.timeout(10000);
      return expect(DiscussionGenerator.generate(discussions, states)
        .then(lines => keccak512(lines.join()))).to.eventually.equal('91b807b2d9244b64f9c421424e7bc4a379db4bccaee0877d08a33db0968c24b92226514b7df740edb24c6f5300698bca694c30d79937a5d77224974aa73d6d4c');
    });
  });
});