
const inquirer = require('inquirer');
const { FAN_ON, FAN_OFF, AUTO } = require('./constant');
const customEmitter = require('./CustomEmitter');

function handleInquiry(answer) {
  switch (answer.action) {
    case FAN_OFF:
      customEmitter.emit(FAN_OFF);
      break;
    case FAN_ON:
      customEmitter.emit(FAN_ON);
      break;
    case AUTO:
      customEmitter.emit(AUTO);
      break;
    default:
      return Promise.reject(new Error(`Invalid selection ${answer.action}`))
    }
}

function inquire() {
  const questions = [
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        {
          name: 'Turn the fan on',
          value: FAN_ON,
        },
        {
          name: 'Turn the fan off',
          value: FAN_OFF,
        },
        {
          name: 'Auto control using sensor',
          value: AUTO,
        },
      ]
    }
  ];

  return inquirer.prompt(questions)
    .then(answer => handleInquiry(answer))
    .then(() => inquire())
}

module.exports = {
  inquire,
};
