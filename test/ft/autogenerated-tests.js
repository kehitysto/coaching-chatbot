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
        .then(lines => keccak512(lines.join()))).to.eventually.equal('68cf9519f202134d15258c38d2f650001711585f41b7a94dccbd832fd567e5bf8b50cae7b0f572bf771c8c3e2a61d00bd13bad28eebfebd7b71f8b6e044c7fc0');
    });
  });
});
