
const app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const customEmitter = require('./CustomEmitter');

const PORT = 8000;

module.exports = {
  initServer: () => {
    console.log('[Server] Setting up socket server')
    app.get('/', function(req, res){
      res.sendFile(__dirname + '/' + 'Team_Fan.html');
    });

    app.get('/Socket_IO.js', function(req, res){
      res.sendFile(__dirname + '/' +  'Socket_IO.js');
    });

    app.get('/Team_Fan.css', function(req, res){
    res.sendFile(__dirname + '/' +  'Team_Fan.css');
    });

    server.listen(PORT, () => {
      console.info('[Server] Successfully established server, listening at port ', PORT);
    });
  },

  emit: (event, message) => {
    try {
      io.emit(event, message);
      console.log('Successfully sent message to socket');
    } catch (e) {
      console.log(`Cannot emit message ${message} to socket with event ${event}`);
      console.error(e)
    }
  }

}
