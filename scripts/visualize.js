import * as fs from 'fs';
import * as discussions from '../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../doc/flow/states.json';

import * as DiscussionGenerator from '../test/generate-discussions';

import { keccak512 } from 'js-sha3';

process.env.RUN_ENV = 'dev';

require('../src/lib/env-vars').config();

let descriptions = [];
let promise = DiscussionGenerator.generate(discussions, states)
  .then((scenarios) => {
    let lines = [];
    let i = 0;
    for (let scenario of scenarios) {
      let hash = keccak512(scenario.content.join());
      ['  { title: \'' + scenario.title.split('# ')[1] + '\',',
       '    hash: \'' + hash + '\' },'].map(l => descriptions.push(l));
      i += 1;

      lines.push(scenario.title);
      for (let line of scenario.content) {
        lines.push(line);
      }
    }
    return lines;
  });

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
   'import { keccak512 } from \'js-sha3\';',
   '',
   'let scenarios;',
   '',
   'let checkData = [',
   ...descriptions,
   '];',
   '',
   'describe(\'Automatically generated feature tests\', () => {',
   '  before(() => {',
   '    DiscussionGenerator.generate(discussions, states)',
   '      .then(result => {',
   '        scenarios = result;',
   '      });',
   '  });',
   '',
   '  for (let i in checkData) {',
   '    describe(checkData[i].title, () => {',
   '      it(\'should match with the given hash sum\', () => {',
   '        return expect(keccak512(scenarios[i].content.join()),',
   '            \'Run \\\'npm run visualize\\\' and \' +',
   '            \'check \\\'\' + checkData[i].title + \'\\\' in \' +',
   '            \'doc/flow/discussions.md. If it looks fine, copy \' +',
   '            \'the hash from automatically generated tests \' +',
   '            \'in the same document.\')',
   '          .to.equal(checkData[i].hash);',
   '      });',
   '    });',
   '  }',
   '});',
   '',
   '```'].join('\n'));
});
