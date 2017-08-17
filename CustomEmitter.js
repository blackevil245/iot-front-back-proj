
const EventEmitter = require('events')

class CustomEmitter extends EventEmitter {}

const customEmitter = new CustomEmitter();

module.exports = customEmitter;
