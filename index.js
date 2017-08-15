
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const port = new SerialPort('/dev/tty-usbserial1', {
  baudRate: 9600,
});

port.on('error', console.error)

const parser = new Readline({ delimiter: '\r\n' });
port.pipe(parser);

parser.on('error', error => {
  console.log(error);
})

parser.on('data', data => {
  console.log(data);
})
