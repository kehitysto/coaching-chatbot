import Strings from '../../src/chatbot/coaching-chatbot.strings.json';

const Formatter = {
  format,
  createProfile
};

export default Formatter;

function format(template, context) {
  let s = Strings[template];

  if (context.name) {
    s.replace('{name}', context.name);
  }
  if (context.job) {
    s.replace('{job}', context.job);
  }
  if (context.age) {
    s.replace('{age}', context.age);
  }
  if (context.place) {
    s.replace('{place}', context.place);
  }

  s.replace('{profile}', create_profile(context));

  return s;
}

function createProfile(context) {
  let profile = `${context.name}, ${context.job}`;

  if (context.age !== undefined) {
    profile += `, ${context.age}`;
  }
  if (context.place !== undefined) {
    profile += `, ${context.place}`;
  }

  return profile;
}
