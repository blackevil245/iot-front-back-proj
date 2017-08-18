
const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const customEmitter = require('./CustomEmitter');
const { NEW_LIGHT_DATA, NEW_FAN_STATE } = require('./constant')

const PORT = 8000;

module.exports = {
  initServer: () => {
    console.log('[Server] Setting up socket server')

    app.use(express.static('assets'));

    app.get('/', function(req, res){
      res.sendFile(__dirname + '/' + 'index.html');
    });

    app.get('/Socket_IO.js', function(req, res){
      res.sendFile(__dirname + '/' +  'Socket_IO.js');
    });

    server.listen(PORT, () => {
      console.info('[Server] Successfully established server, listening at port ', PORT);
    });

    io.on(NEW_LIGHT_DATA, (message) => console.log(message));
    io.on(NEW_FAN_STATE, (message) => console.log(message));
  },

  emit: (event, message) => {
    try {
      io.emit(event, message);
    } catch (e) {
      console.log(`Cannot emit message ${message} to socket with event ${event}`);
      console.error(e)
    }
  }

}
