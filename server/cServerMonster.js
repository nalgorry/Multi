"use strict";
var cServerMonster = (function () {
    function cServerMonster(monsterId, socket) {
        this.monsterId = monsterId;
        this.socket = socket;
    }
    cServerMonster.prototype.startMonster = function (monsterLife, tileX, tileY) {
        this.monsterLife = monsterLife;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket.emit('new Monster', { id: this.monsterId, tileX: this.tileX, tileY: this.tileX });
    };
    cServerMonster.prototype.sendMonsterToNewPlayer = function (socket) {
        socket.emit('new Monster', { id: this.monsterId, tileX: this.tileX, tileY: this.tileX });
    };
    return cServerMonster;
}());
exports.cServerMonster = cServerMonster;
