var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var ioServer:SocketIO.Server = require('socket.io');

//require('./cPlayer');
import {cPlayer} from './cPlayer';

var port = process.env.PORT || 8080

// variables del juego
var socket:SocketIO.Server	// Socket controller
var players:cPlayer[]	// Array of connected players

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
  client.on('player click', onPlayerClick)

  //chat listener
  client.on('Chat Send', onChatSend)

  //te mataron :(
  client.on('you die', onYouDie)

  //Player Change
  client.on('you change', onYouChange)

}

function onYouChange(data) {

    if(data.name != null) {
      var player:cPlayer = playerById(this.id);

      if (player != null) {
        player.playerName = data.name;
        this.broadcast.emit('player change', {id: this.id, name:data.name})
      }

    }

}

function onYouDie(data) {

  var player:cPlayer = playerById(this.id);

  //primero envio al que mato su kill
  if (player != null) {
    socket.sockets.connected[data.idPlayerKill].emit('you kill',{name: player.playerName});

    //envio al que murio quien lo mato
    var playerKill:cPlayer = playerById(data.idPlayerKill);
    if (playerKill != null) {
      this.emit('you die', {name: playerKill.playerName});
    }
  }

}

function onChatSend(data) {
    util.log('Player has chat: ' + data.text);

    this.broadcast.emit('Chat Receive', {id: this.id, text: data.text});
}

function onPlayerClick(data) {

   var player:cPlayer = playerById(data.idPlayerHit);
  
   if (player != null) {

      //recorrro los hechizos para actual segun lo que hizo cada uno
      var damage = player.spellActivated(data);
      
      // mando el golpe a los jugadores
      this.broadcast.emit('player hit', {id: player.playerId, playerThatHit:this.id, x: player.x, y: player.y,damage:damage, idSpell: data.idSpell});
      this.emit('you hit', {id: player.playerId,damage: damage,idSpell: data.idSpell});

  }

  socket.emit('power throw', {x:player.x, y:player.y}); //esto manda a todos, incluso al jugador actual

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
  var newPlayer:cPlayer = new cPlayer(this.id,data.name,data.x, data.y)
  
  this.broadcast.emit('new player', {id: newPlayer.playerId, x: newPlayer.x, y: newPlayer.y, name:data.name})

  var i:number;
  var existingPlayer: cPlayer;
  for (i = 0; i < players.length; i++) { // Send existing players to the new player
    existingPlayer = players[i]
    this.emit('new player', {id: existingPlayer.playerId, 
      x: existingPlayer.x, y: existingPlayer.y,
      name:existingPlayer.playerName})
  }

  // Add new player to the players array
  players.push(newPlayer);
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

  this.broadcast.emit('move player', {id: movePlayer.playerId, x: movePlayer.x, y: movePlayer.y,dirMov: movePlayer.dirMov })
}


function playerById (id:string): cPlayer {
  var i:number;
  
  for (i = 0; i < players.length; i++) {
      if (players[i].playerId === id) {
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