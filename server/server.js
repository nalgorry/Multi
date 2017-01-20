"use strict";
var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var ioServer = require('socket.io');
//require('./cPlayer');
var cPlayer_1 = require('./cPlayer');
var cServerControlMonster_1 = require('./cServerControlMonster');
var cControlServerPlayers_1 = require('./cControlServerPlayers');
var cServerControlItems_1 = require('./items/cServerControlItems');
var port = process.env.PORT || 8080;
// variables del juego
var socket; // Socket controller
var controlPlayers; //control los jugadores
var controlMonster; //control los mounstros
var controlItems;
// Create and start the http server
var server = http.createServer(ecstatic({ root: path.resolve(__dirname, '../public') })).listen(port, function (err) {
    if (err) {
        throw err;
    }
    init();
});
function init() {
    socket = ioServer.listen(server);
    socket.sockets.on('connection', onSocketConnection);
    controlPlayers = new cControlServerPlayers_1.cServerControlPlayers(socket);
    controlItems = new cServerControlItems_1.cServerControlItems(socket);
    controlMonster = new cServerControlMonster_1.cServerControlMonster(socket, controlPlayers, controlItems);
}
// New socket connection
function onSocketConnection(client) {
    util.log('New player has connnnected: ' + client.id);
    // Listen for client disconnected
    client.on('disconnect', onClientDisconnect);
    // Listen for new player message
    client.on('new player', onNewPlayer);
    // Listen for move player message
    client.on('move player', onMovePlayer);
    //Listen for mouses click
    client.on('player click', onPlayerClick);
    //chat listener
    client.on('Chat Send', onChatSend);
    //te mataron :(
    client.on('you die', onYouDie);
    //Player Change
    client.on('you change', onYouChange);
    client.on('enter portal', onYouEnterPortal);
    client.on('monster click', onYouClickMonster);
    client.on('you try get item', onYouTryGetItem);
    client.on('you equip item', onYouEquipItem);
    client.on('you drop item', onYouDropItem);
}
function onYouDropItem(data) {
    console.log(data);
    controlItems.dropItemToFloor(data);
}
function onYouEquipItem(data) {
    controlPlayers.youEquipItem(this, data);
}
function onYouTryGetItem(data) {
    controlItems.youGetItem(this, data);
}
function onYouEnterPortal(data) {
    var player = controlPlayers.getPlayerById(this.id);
    this.emit('you enter portal', { idPortal: data.idPortal });
}
function onYouClickMonster(data) {
    var player = controlPlayers.getPlayerById(this.id);
    if (player != null) {
        controlMonster.monsterHit(data, player);
    }
    else {
        console.log("error al procesar golpe a mounstro");
    }
}
function onYouChange(data) {
    if (data.name != null) {
        var player = controlPlayers.getPlayerById(this.id);
        if (player != null) {
            player.playerName = data.name;
            this.broadcast.emit('player change', { id: this.id, name: data.name });
        }
    }
}
function onYouDie(data) {
    var player = controlPlayers.getPlayerById(this.id);
    //primero envio al que mato su kill
    if (player != null) {
        var playerKill = controlPlayers.getPlayerById(data.idPlayerKill);
        if (playerKill != null) {
            socket.sockets.connected[data.idPlayerKill].emit('you kill', { name: player.playerName });
            this.emit('you die', { name: playerKill.playerName });
        }
        else {
            this.emit('you die', { name: 'un Monstruo' });
        }
    }
}
function onChatSend(data) {
    util.log('Player has chat: ' + data.text);
    this.broadcast.emit('Chat Receive', { id: this.id, text: data.text });
}
function onPlayerClick(data) {
    var player = controlPlayers.getPlayerById(this.id);
    var playerHit = controlPlayers.getPlayerById(data.idPlayerHit);
    if (playerHit != null) {
        //recorrro los hechizos para actual segun lo que hizo cada uno
        var damage = player.spellActivated(data); //saco del player por cuanto golpeo
        damage = playerHit.calculateDamage(damage); //calculo el daño restando la defensa y demas 
        // mando el golpe a los jugadores
        this.broadcast.emit('player hit', { id: playerHit.playerId, playerThatHit: this.id, x: player.x, y: player.y, damage: damage, idSpell: data.idSpell });
        this.emit('you hit', { id: playerHit.playerId, damage: damage, idSpell: data.idSpell });
    }
    socket.emit('power throw', { x: player.x, y: player.y }); //esto manda a todos, incluso al jugador actual
}
// Socket client has disconnected
function onClientDisconnect() {
    util.log('Player has disconnected: ' + this.id);
    controlPlayers.onPlayerDisconected(this);
    this.broadcast.emit('remove player', { id: this.id });
}
// New player has joined
function onNewPlayer(data) {
    // Create a new player
    var newPlayer = new cPlayer_1.cPlayer(this, this.id, data.name, data.x, data.y);
    controlPlayers.onNewPlayerConected(this, this.id, data);
    controlMonster.onNewPlayerConected(this);
    controlItems.onNewPlayerConected(this);
}
// Player has moved
function onMovePlayer(data) {
    // Find player in array
    var movePlayer = controlPlayers.getPlayerById(this.id);
    // Player not found
    if (!movePlayer) {
        util.log('Player not found: ' + this.id);
        return;
    }
    movePlayer.x = data.x;
    movePlayer.y = data.y;
    movePlayer.dirMov = data.dirMov;
    this.broadcast.emit('move player', { id: movePlayer.playerId, x: movePlayer.x, y: movePlayer.y, dirMov: movePlayer.dirMov });
}
