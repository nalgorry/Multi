"use strict";
var cServerControlPlayers = (function () {
    function cServerControlPlayers(socket) {
        this.socket = socket;
    }
    cServerControlPlayers.prototype.getPlayerById = function (id) {
        return this.arrayPlayers[id];
    };
    return cServerControlPlayers;
}());
exports.cServerControlPlayers = cServerControlPlayers;
