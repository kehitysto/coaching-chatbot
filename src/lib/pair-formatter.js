import pif
from './personal-information-formatter-service';

import cmf
from './communication-methods-formatter';

const Formatter = {
  createPairString,
  beautifyAvailablePairs,
};

export default Formatter;

/**
 * @param {Context} context
 * @return {string}
 */
function createPairString(context) {
  const s =
    Object.keys(context.communicationMethods)
    .map((v) => `  - ${cmf.getCommunicationMethodByIdentifier(v).name}`)
    .join('\n');

  return `${pif.createProfile(context)}\n${s}`;
}

/**
 * @param {Array} dumps
 * @return {string}
 */
function beautifyAvailablePairs(dumps) {
  const a = dumps.map((d) => createPairString(d.context));
  return a.join('\n\n');
}
