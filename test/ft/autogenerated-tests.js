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
        .then(lines => keccak512(lines.join()))).to.eventually.equal('67ada0d34879b00adfaad86a2d1c69edd24391ed8e5b998e6986b16ce27f8fe3496731a291d5750f49cebcea6e652f02b5e5ef235c4eadcb99599d74fa04b3e5');
    });
  });
});
