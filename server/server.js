"use strict";
var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var ioServer = require('socket.io');
//require('./cPlayer');
var cServerControlMaps_1 = require('./maps/cServerControlMaps');
var port = process.env.PORT || 8080;
// variables del juego
var socket; // Socket controller
var controlMaps; //control the players maps
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
    controlMaps = new cServerControlMaps_1.cServerControlMaps(socket);
}
// New socket connection
function onSocketConnection(client) {
    util.log('New player has connnnected: ' + client.id);
    // Listen for new player message
    client.on('new player', onNewPlayer);
    // Listen for client disconnected
    client.on('disconnect', onClientDisconnect);
    // Listen for move player message
    client.on('move player', onMovePlayer);
    //Listen for mouses click
    client.on('actor click', onActorClick);
    //chat listener
    client.on('Chat Send', onChatSend);
    //te mataron :(
    client.on('you die', onYouDie);
    //Player Change
    client.on('you change', onYouChange);
    client.on('enter portal', onYouEnterPortal);
    client.on('you try get item', onYouTryGetItem);
    client.on('you equip item', onYouEquipItem);
    client.on('you drop item', onYouDropItem);
    client.on('level up', onLevelUp);
}
// New player has joined
function onNewPlayer(data) {
    controlMaps.onNewPlayer(this, data);
}
// Socket client has disconnected
function onClientDisconnect() {
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
function onYouChange(data) {
    controlMaps.youChange(this, data);
}
function onYouDie(data) {
    controlMaps.playerDie(this, data);
}
function onChatSend(data) {
    controlMaps.chatSend(this, data);
}
function onActorClick(data) {
    //TODO VER SI ESTO AUN SE USA 
    controlMaps.spellCast(this, data);
}
// Player has moved
function onMovePlayer(data) {
    controlMaps.onMovePlayer(this, data);
}
