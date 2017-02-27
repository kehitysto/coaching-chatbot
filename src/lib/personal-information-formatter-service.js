import Strings from '../../src/chatbot/coaching-chatbot.strings.json';

const Formatter = {
  format,
  createProfile
};

export default Formatter;

function format(template, context) {
  let s = Strings[template];

  if (context.name) {
    s = s.replace('{name}', context.name);
  }

  if (context.job) {
    s = s.replace('{job}', context.job);
  }

  if (context.age) {
    s = s.replace('{age}', context.age);
  }

  if (context.place) {
    s = s.replace('{place}', context.place);
  }

  s = s.replace('{profile}', createProfile(context));

  return s;
}

function createProfile(context) {
  return [context.name, context.job,
      context.age, context.place
    ]
    .filter(val => val)
    .join(", ");
}
