"use strict";
var cServerMonster = (function () {
    function cServerMonster(monsterId, socket, controlPlayer) {
        this.monsterId = monsterId;
        this.socket = socket;
        this.controlPlayer = controlPlayer;
        this.monsterDie = false; //para chekear si el moustro se murio o no
        //variables para definir el ataque
        this.gridSize = 40;
        this.monsterAtackTilesX = 13;
        this.monsterAtackTilesY = 9;
    }
    cServerMonster.prototype.startMonster = function (tileX, tileY, monsterLife, monsterPower) {
        var _this = this;
        this.monsterLife = monsterLife;
        this.tileX = tileX;
        this.tileY = tileY;
        this.monsterPower = monsterPower;
        console.log({ id: this.monsterId, tileX: this.tileX, tileY: this.tileY });
        this.socket.emit('new Monster', { id: this.monsterId, tileX: this.tileX, tileY: this.tileY });
        var timer = setTimeout(function () { return _this.monsterAtack(); }, 650);
    };
    cServerMonster.prototype.monsterHit = function (data, player) {
        var damage = player.spellActivated(data);
        player.socket.emit('you hit monster', { idMonster: this.monsterId, damage: damage, idSpell: data.idSpell });
        this.monsterLife -= damage;
        //controlo si se murio el moustro 
        if (this.monsterLife <= 0) {
            this.socket.emit('monster die', { idMonster: this.monsterId, idPlayer: player.playerId });
            this.monsterDie = true;
        }
    };
    cServerMonster.prototype.monsterAtack = function () {
        var _this = this;
        //controlo que jugador esta demasiado cerca de un moustro
        for (var idPlayer in this.controlPlayer.arrayPlayers) {
            var player = this.controlPlayer.arrayPlayers[idPlayer];
            var playerTileX = Math.round(player.x / this.gridSize);
            var playerTileY = Math.round(player.y / this.gridSize);
            if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
                Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
                this.socket.emit('monster hit', {
                    idMonster: this.monsterId,
                    idPlayer: player.playerId,
                    damage: Math.round(Math.random() * this.monsterPower + 1),
                    idSpell: 3,
                });
            }
        }
        if (this.monsterDie == false) {
            var timer = setTimeout(function () { return _this.monsterAtack(); }, 650);
        }
    };
    cServerMonster.prototype.sendMonsterToNewPlayer = function (socket) {
        socket.emit('new Monster', { id: this.monsterId, tileX: this.tileX, tileY: this.tileY });
    };
    return cServerMonster;
}());
exports.cServerMonster = cServerMonster;
