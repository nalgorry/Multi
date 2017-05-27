var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var ioServer:SocketIO.Server = require('socket.io');

//require('./cPlayer');
import {cServerControlMaps} from './maps/cServerControlMaps';

var port = process.env.PORT || 8080

// variables del juego
var socket:SocketIO.Server	// Socket controller

var controlMaps:cServerControlMaps; //control the players maps

// Create and start the http server
var server = http.createServer(
  ecstatic({ root: path.resolve(__dirname, '../public') })
).listen(port, function (err) {
  if (err) {
    throw err
  }

  init()
})

function init () {

  socket = ioServer.listen(server)
  socket.sockets.on('connection', onSocketConnection)

  controlMaps = new cServerControlMaps(socket);

}

// New socket connection
function onSocketConnection (client) {
  util.log('New player has connnnected: ' + client.id)

    // Listen for new player message
  client.on('new player', onNewPlayer)

  // Listen for client disconnected
  client.on('disconnect', onClientDisconnect)

  // Listen for move player message
  client.on('move player', onMovePlayer)

  //Listen for mouses click
  client.on('player click', onPlayerClick)

  //chat listener
  client.on('Chat Send', onChatSend)

  //te mataron :(
  client.on('you die', onYouDie)

  //Player Change
  client.on('you change', onYouChange)

  client.on('enter portal',onYouEnterPortal);

  client.on('monster click',onYouClickMonster);

  client.on('you try get item',onYouTryGetItem);

  client.on('you equip item',onYouEquipItem);

  client.on('you drop item',onYouDropItem);

  client.on('level up',onLevelUp);

}

// New player has joined
function onNewPlayer (data) {
    controlMaps.onNewPlayer(this, data); 
}

// Socket client has disconnected
function onClientDisconnect () {
  controlMaps.onPlayerDisconnected(this);
}


function onLevelUp(data) {
    controlMaps.onLevelUp(this, data);
}

function onYouDropItem(data) {
    
    controlMaps.dropItemToFloor(this, data);
}

function onYouEquipItem(data) {
    controlMaps.youEquipItem(this, data);
}

function onYouTryGetItem(data) {
      controlMaps.youGetItem(this, data);
}

function onYouEnterPortal(data) {
  
  controlMaps.enterPortal(this, data);

}

function onYouClickMonster(data) {
    controlMaps.spellCast(this, data);
}

function onYouChange(data) {
    controlMaps.youChange(this, data);
}

function onYouDie(data) {
  controlMaps.playerDie(this, data);
}

function onChatSend(data) {
    this.broadcast.emit('Chat Receive', {id: this.id, text: data.text});
}

function onPlayerClick(data) {

    //TODO VER SI ESTO AUN SE USA 
    controlMaps.spellCast(this, data);

}

// Player has moved
function onMovePlayer (data) {
  controlMaps.onMovePlayer(this, data); 
}


