import * as fs from 'fs';
import * as discussions from '../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../doc/flow/states.json';

import * as DiscussionGenerator from '../test/generate-discussions';

process.env.RUN_ENV = 'dev';

require('../src/lib/env-vars').config();

let promise = DiscussionGenerator.generate(discussions, states);

promise = promise.then((lines) => {
  const target = path.resolve(__dirname, '..', 'doc', 'flow', 'discussions.md');
  fs.writeFileSync(target, lines.join('\n'));
});
