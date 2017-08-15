'use strict';

const actorHandler = require('./actor').handleData;

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const BAUD_RATE = 9600;
const PORT_NAME = '/dev/tty-usbserial1';

const arduinoPort = new SerialPort(PORT_NAME, {
  baudRate: BAUD_RATE,
  autoOpen: false,
});

arduinoPort.open();
arduinoPort.on('open', () => {
  console.log('Successfully established connection to Arduino port ' + PORTNAME + ' with ' + BAUD_RATE ' baud rate.');
})
arduinoPort.on('error', console.error);
arduinoPort.on('open', console.error);
arduinoPort.on('close', console.error);

const arduino = new Readline({ delimiter: '\r\n' });

try {
  arduinoPort.pipe(arduino);

  // Handle the data on a seprated file
  arduino.on('data', actorHandler);

  arduino.on('error', error => {
    console.log(error);
    throw error;
  });
} catch (error) {
  console.error(error.message);
  console.error(error.stack);
}
