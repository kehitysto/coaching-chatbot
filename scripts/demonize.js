import * as fs from 'fs';
import * as discussions from '../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../doc/flow/states.json';

import * as DiscussionGenerator from '../test/generate-discussions';
import { setTimeout } from 'timers';

process.env.RUN_ENV = 'dev';

require('../src/lib/env-vars').config();

let descriptions = [];
let promise = DiscussionGenerator.generate(discussions, states)
  .then((scenarios) => {
    let lines = [];
    for (let scenario of scenarios) {
      let user = scenario.content[0].split('|')[2].trim();
      if (user == "Kaapo") {
        for (let i = 2; i < scenario.content.length; i += 1) {
          lines.push(scenario.content[i].replace(new RegExp('\'', 'g'), '\\\''));
        }
      }
    }
    return lines;
  })
  .then((lines) => {
    let alines = [];
    for (let line of lines) {
      let splitted = line.split('|')
      alines.push('[\'' + splitted[1].trim() +
        '\', \'' + splitted[2].trim() + '\']');
    }
    return alines;
  })
  .then((lines) => {
    const target = path.resolve(__dirname, '..', 'doc', 'flow', 'demo.js');
    fs.writeFileSync(target, 'let data = [' + lines.join(',\n') + '];\n' + [
      'function addPlayerMessage(text) {',
      '  let msg = document.createElement(\'div\');',
      '  msg.setAttribute(\'class\', \'kaapo\')',
      '  msg.innerHTML = text',
      '  removeButtons();',
      '  document.getElementById(\'demoContainer\').appendChild(msg)',
      '}',
      'function addBotMessage(text) {',
      '  let msg = document.createElement(\'div\');',
      '  removeButtons();',
      '  if (!text.includes(\'[\')) {',
      '    msg.setAttribute(\'class\', \'bot\')',
      '    msg.innerHTML = text',
      '  } else {',
      '    msg.setAttribute(\'class\', \'buttons\')',
      '    msg.innerHTML = text',
      '      .replace(new RegExp(/\\[/g), \'<span class=\\\'button\\\'>\')',
      '      .replace(new RegExp(/\\]/g), \'</span>\');',
      '  }',
      '  document.getElementById(\'demoContainer\').appendChild(msg)',
      '}',
      'function removeButtons() {',
      '  for (let btn of document.getElementsByClassName(\'buttons\')) {',
      '    btn.style = \'display: none;\';',
      '  }',
      '}',
      'function demoStart(i) {',
      '  if (i < data.length) {',
      '    let time = 100;',
      '    if (data[i][0].length == 0) {',
      '      setTimeout(function(){addPlayerMessage(data[i][1]);',
      '      window.scrollTo(0,document.body.scrollHeight);}, 2500);',
      '      time += 3000;',
      '    } else {',
      '      addBotMessage(data[i][0]);',
      '      window.scrollTo(0,document.body.scrollHeight);',
      '    }',
      '    setTimeout(function(){demoStart(i+1)}, time);',
      '  }',
      '}'
    ].join('\n'));
  });
