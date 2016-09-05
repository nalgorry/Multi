var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var ioServer:SocketIO.Server = require('socket.io');

//require('./cPlayer');
import {cPlayer} from './cPlayer';

//var Player:cPlayer = require('./cPlayer')


var port = process.env.PORT || 8080

// variables del juego
var socket	// Socket controller
var players:cPlayer[]	// Array of connected players

/* ************************************************
** GAME INITIALISATION
************************************************ */

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
  //aca van los jugadores
  players = []

  socket = ioServer.listen(server)
  socket.sockets.on('connection', onSocketConnection)
}

// New socket connection
function onSocketConnection (client) {
  util.log('New player has connnnected: ' + client.id)

  // Listen for client disconnected
  client.on('disconnect', onClientDisconnect)

  // Listen for new player message
  client.on('new player', onNewPlayer)

  // Listen for move player message
  client.on('move player', onMovePlayer)

  //Listen for mouses click
  client.on('mouse click', onMouseClick)

    //Listen for mouses click
  client.on('player click', onPlayerClick)

  //chat listener
  client.on('Chat Send', onChatSend)

}

function onChatSend(data) {
    util.log('Player has chat: ' + data.text);

    this.broadcast.emit('Chat Receive', {id: this.id, text: data.text});
}

function onPlayerClick(data) {

   var player:cPlayer = playerById(data.idPlayerHit);

  
   if (player != null) {

    if (data.idSpell == 0 ) {
        var damage:number = Math.round(Math.random()*40+40);
    } else if (data.idSpell == 1) {
        var damage:number = Math.round(Math.random()*45+5);
        if (Math.random() < 0.15) { //daño critico!
          damage = damage + 100;
          util.log("daño critico");
        }
    }
    
    player.playerLife -= damage;

    // mando el golpe a los jugadores
    this.broadcast.emit('player hit', {id: player.id, x: player.x, y: player.y,damage:damage, idSpell: data.idSpell});
    this.emit('you hit', {id: player.id,damage: damage,idSpell: data.idSpell});

    //mataron a alguien finalmente 
    if (player.playerLife <= 0) { 
      this.broadcast.emit('player die', {id: player.id, x: player.x, y: player.y,damage:damage});
      this.emit('you kill', {damage: damage});
      player.playerLife = 100;
    }
  }

  //this.broadcast.emit('power throw', {x:data. x, y:data.y});
  socket.emit('power throw', {x:player.x, y:player.y});

}

//on mouse click 
function onMouseClick(data) {

}

// Socket client has disconnected
function onClientDisconnect () {
  util.log('Player has disconnected: ' + this.id)

  var removePlayer = playerById(this.id)

  // Player not found
  if (!removePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1)

  this.broadcast.emit('remove player', {id: this.id})
}

// New player has joined
function onNewPlayer (data) {
  // Create a new player
  var newPlayer:cPlayer = new cPlayer(data.x, data.y,this.id)
  newPlayer.playerLife = 100;
  
  this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.x, y: newPlayer.y})

  var i:number;
  var existingPlayer: cPlayer;
  for (i = 0; i < players.length; i++) { // Send existing players to the new player
    existingPlayer = players[i]
    this.emit('new player', {id: existingPlayer.id, x: existingPlayer.x, y: existingPlayer.y})
  }

  // Add new player to the players array
  players.push(newPlayer)
}

// Player has moved
function onMovePlayer (data) {
  // Find player in array
  var movePlayer = playerById(this.id)

  // Player not found
  if (!movePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }

  movePlayer.x = data.x;
  movePlayer.y = data.y;
  movePlayer.dirMov = data.dirMov;

  this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y,dirMov: movePlayer.dirMov })
}


function playerById (id:string): cPlayer {
  var i:number;
  
  for (i = 0; i < players.length; i++) {
      if (players[i].id === id) {
        return players[i];
      }
  }

  return null
}

function playerByXY (x:number,y:number): cPlayer {
  var i:number;
  
  for (i = 0; i < players.length; i++) {
      if (players[i].x === x && players[i].y === y) {
        return players[i];
      }
  }

  return null
}