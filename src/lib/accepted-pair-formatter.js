import pif
from './personal-information-formatter-service';

import cmf
from './communication-methods-formatter';

const Formatter = {
  createPairString,
  beautifyAcceptedPair,
};

export default Formatter;

function createPairString(context) {
  const s = cmf.createCommunicationMethodslist(context).map(function(v) {
    return `\n - ${v}`;
  });
  return `${pif.createProfile(context)}${s}`;
}

function beautifyAcceptedPair(dumps) {
  const a = dumps.map((d) => createPairString(d.context));
  return a.join('\n\n');
}
