'use strict';

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline({ delimiter: '\r\n' });
const customEmitter = require('./CustomEmitter');
const socketServer = require('./server');

const {
  FAN_ON,
  FAN_OFF,
  AUTO,
  NEW_HEAT_DATA,
  NEW_LIGHT_DATA,
  NEW_FAN_STATE,
} = require('./constant');

// Arduino port instance and settings
const BAUD_RATE = 9600;
const PORT_NAME = '/dev/cu.usbmodem1411';
process.env.AUTO = false;

const arduinoPort = new SerialPort(PORT_NAME, {
  baudRate: BAUD_RATE,
  autoOpen: false,
});

function writeArduinoMessage(message) {
  return new Promise((resolve, reject) => {
    arduinoPort.write(message, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve('Successfully write Arduino message', message)
      }
    });
  })
}

function startArduinoConnection() {
  console.log(`Trying to connect to Arduino through serial port ${PORT_NAME} with baud rate ${BAUD_RATE}`)
  arduinoPort.open();

  arduinoPort.on('error', e => {
    console.log('Received error: ', e);
  });

  arduinoPort.on('close', () => {
    console.log('Closing connection.')
  });

  arduinoPort.on('open', () => {
    console.log('Successfully established connection to Arduino port ' + PORT_NAME + ' with ' + BAUD_RATE + ' baud rate.');

    // Handle the data sent from the arduino
    arduinoPort.pipe(parser);

    // Handle the sensor data
    parser.on('data', (data) => {
      try {
        const parsedData = JSON.parse(data);
        console.log('Emitting new sensor data', JSON.stringify(parsedData))
        customEmitter.emit(NEW_HEAT_DATA, parsedData.c)
        customEmitter.emit(NEW_LIGHT_DATA, parsedData.l)
      } catch (e) {
        console.log('Malformed data format, ignoring. Error: ', e.message);
      }
    });

    // Handle the sensor error
    parser.on('error', error => {
      throw error;
    });
  });
}

try {
  // Start the socket server
  socketServer.initServer();

  customEmitter.on(FAN_ON, () => {
    console.log('Turning the fan on.');
    writeArduinoMessage(FAN_ON);
  });

  customEmitter.on(FAN_OFF, () => {
    console.log('Turning the fan off.');
    writeArduinoMessage(FAN_OFF);
  });

  customEmitter.on(AUTO, () => {
    console.log('Going auto mode ......');
    process.env.AUTO = true;
  });

  customEmitter.on(NEW_HEAT_DATA, heatData => {
    // Emit for socket regardless of control mode
    socketServer.emit(NEW_HEAT_DATA, heatData)
    if (process.env.AUTO === false) {
      // Ignore
    } else {

    }
  });

  customEmitter.on(NEW_LIGHT_DATA, lightData => {
    // Emit for socket regardless of control mode
    socketServer.emit(NEW_LIGHT_DATA, lightData);
    if (process.env.AUTO === false) {
      // Ignore
    } else {

    }
  });

  customEmitter.on(NEW_FAN_STATE, fanData => {
    // Emit for socket regardless of control mode
    socketServer.emit(NEW_FAN_STATE, fanData);
  })

  startArduinoConnection();

} catch (error) {
  console.error(error.message);
  console.error(error.stack);
  process.exit(1)
}
