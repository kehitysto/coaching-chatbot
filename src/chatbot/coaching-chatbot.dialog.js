import Dialog from './dialog';
import strings from './strings.json';


const dialog = new Dialog(strings);

dialog.addState(
    'base',
    [
        (session) => {
            session.addResult("GREETING");
            session.endDialog();
        }
    ]
);

module.exports = dialog;
