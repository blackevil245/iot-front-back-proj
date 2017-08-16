'use strict';

const parseSensorMessage = require('./actor').parseSensorMessage;
const timers = require('timers')
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const BAUD_RATE = 9600;
const PORT_NAME = '/dev/cu.usbmodem1421';
// const PORT_NAME = '/dev/cu.usbmodem1411';

let arduinoPort;

arduinoPort = new SerialPort(PORT_NAME, {
  baudRate: BAUD_RATE,
  autoOpen: false,
});

arduinoPort.open();

arduinoPort.on('error', e => {
  console.log('Received error: ', e);
});
arduinoPort.on('close', () => {
  console.log('Closing connection.')
});

arduinoPort.on('open', () => {
  console.log('Successfully established connection to Arduino port ' + PORTNAME + ' with ' + BAUD_RATE + ' baud rate.');
  const arduino = new Readline({ delimiter: '\r\n' });

  timers.setInterval(() => {
    console.log('Writting message to arduino')
    arduinoPort.write('hello', function(err) {
      if (err) {
        console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
  }, 2000)

  try {
    arduinoPort.pipe(arduino);

    // Handle the sensor data on a separated file
    arduino.on('data', parseSensorMessage);

    arduino.on('error', error => {
      console.log(error);
      throw error;
    });
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
  }
});
