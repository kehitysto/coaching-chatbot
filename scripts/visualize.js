import * as fs from 'fs';
import * as discussions from '../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../doc/flow/states.json';

import * as DiscussionGenerator from '../test/generate-discussions';

import { keccak512 } from 'js-sha3';

process.env.RUN_ENV = 'dev';

require('../src/lib/env-vars').config();

let promise = DiscussionGenerator.generate(discussions, states);

promise = promise.then((lines) => {
  const target = path.resolve(__dirname, '..', 'doc', 'flow', 'discussions.md');
  let hash = keccak512(lines.join());
  fs.writeFileSync(target, lines.join('\n') + '\n' + 
  ['# Automatic validation',
   'Copy this to test/ft to automate this test:',
   '```javascript',
   'import * as discussions from \'../../doc/flow/discussions.json\';',
   'import * as path from \'path\';',
   'import * as states from \'../../doc/flow/states.json\';',
   'import * as DiscussionGenerator from \'../generate-discussions\';',
   'import { keccak512 } from \'js-sha3\'',
   '',
   'describe(\'Automatically generated feature test\', function() {',
   '  describe(\'As a user I want the chatbot to work correctly\', function() {',
   '    it(\'should match with the given hash sum\', function() {',
   '      this.timeout(10000);',
   '      return expect(DiscussionGenerator.generate(discussions, states)',
   '        .then(lines => keccak512(lines.join()))).to.eventually.equal(\'' + hash + '\');',
   '    });',
   '  });',
   '});',
   '```'].join('\n'));
});
