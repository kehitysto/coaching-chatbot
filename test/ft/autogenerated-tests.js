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
        .then(lines => keccak512(lines.join()))).to.eventually.equal('50dc404c11b4bf127af61c1d1c0b7d962bdb159c0b05dda4758efe5974cb573693db835b63f612e9c3e4d990f7f26760b8c3fffc89a70c31f7cde11d80a164ed');
    });
  });
});