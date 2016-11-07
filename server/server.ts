var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var ioServer:SocketIO.Server = require('socket.io');

//require('./cPlayer');
import {cPlayer} from './cPlayer';
import {cServerControlMonster} from './cServerControlMonster';
import {cServerControlPlayers} from './cControlServerPlayers';

var port = process.env.PORT || 8080

// variables del juego
var socket:SocketIO.Server	// Socket controller

var controlPlayers:cServerControlPlayers; //control los jugadores
var controlMonster:cServerControlMonster; //control los mounstros

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

  controlPlayers = new cServerControlPlayers(socket);
  controlMonster = new cServerControlMonster(socket,controlPlayers);
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

  client.on('monster click',onYouClickMonster)

}

function onYouClickMonster(data) {

    var player = controlPlayers.getPlayerById(data.idPlayer);

    if (player != null) {
      controlMonster.monsterHit(data,player)
    } else {
      console.log("error al procesar golpe a mounstro")
    }

}

function onYouChange(data) {

    if(data.name != null) {
      var player:cPlayer = controlPlayers.getPlayerById(this.id);

      if (player != null) {
        player.playerName = data.name;
        this.broadcast.emit('player change', {id: this.id, name:data.name})
      }

    }

}

function onYouDie(data) {

  var player:cPlayer = controlPlayers.getPlayerById(this.id);

  //primero envio al que mato su kill
  if (player != null) {
    
    var playerKill:cPlayer = controlPlayers.getPlayerById(data.idPlayerKill);
    if (playerKill != null) {
      socket.sockets.connected[data.idPlayerKill].emit('you kill',{name: player.playerName});
      this.emit('you die', {name: playerKill.playerName});
    } else { //lo mato un monster, que cagada...
      this.emit('you die', {name: 'un Monstruo'});
    }

    //envio al que murio quien lo mato
    
  }

}

function onChatSend(data) {
    util.log('Player has chat: ' + data.text);

    this.broadcast.emit('Chat Receive', {id: this.id, text: data.text});
}

function onPlayerClick(data) {

   var player:cPlayer = controlPlayers.getPlayerById(data.idPlayerHit);
  
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

  controlPlayers.onPlayerDisconected(this)

   this.broadcast.emit('remove player', {id: this.id})
}

// New player has joined
function onNewPlayer (data) {
  
  // Create a new player
  var newPlayer:cPlayer = new cPlayer(this,this.id,data.name,data.x, data.y)

  controlPlayers.onNewPlayerConected(this,this.id,data)
  controlMonster.onNewPlayerConected(this);

}

// Player has moved
function onMovePlayer (data) {
  // Find player in array
  var movePlayer = controlPlayers.getPlayerById(this.id)

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


