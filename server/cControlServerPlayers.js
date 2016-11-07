"use strict";
var cPlayer_1 = require('./cPlayer');
var cServerControlPlayers = (function () {
    function cServerControlPlayers(socket) {
        this.socket = socket;
        this.arrayPlayers = [];
    }
    cServerControlPlayers.prototype.getPlayerById = function (id) {
        return this.arrayPlayers[id];
    };
    cServerControlPlayers.prototype.onNewPlayerConected = function (socket, idPlayer, data) {
        socket.broadcast.emit('new player', { id: idPlayer, x: data.x, y: data.y, name: data.name });
        //le mando al nuevo jugador todos los jugadores existentes
        for (var id in this.arrayPlayers) {
            this.arrayPlayers[id].sendPlayerToNewPlayer(socket);
        }
        // Add new player to the players array
        this.arrayPlayers[idPlayer] = new cPlayer_1.cPlayer(socket, idPlayer, data.name, data.x, data.y);
    };
    cServerControlPlayers.prototype.onPlayerDisconected = function (socket) {
        delete this.arrayPlayers[socket.id];
    };
    return cServerControlPlayers;
}());
exports.cServerControlPlayers = cServerControlPlayers;
