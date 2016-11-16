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
        var timerAtack = setTimeout(function () { return _this.monsterAtack(); }, 1200);
        var timerMove = setTimeout(function () { return _this.monsterMove(); }, 800);
    };
    cServerMonster.prototype.monsterMove = function () {
        var _this = this;
        var playerNear = undefined;
        //controlo si hay algun jugador cerca del monstruo
        for (var idPlayer in this.controlPlayer.arrayPlayers) {
            var player = this.controlPlayer.arrayPlayers[idPlayer];
            var playerTileX = Math.round(player.x / this.gridSize);
            var playerTileY = Math.round(player.y / this.gridSize);
            var data;
            if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
                Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
                playerNear = player;
            }
        }
        if (playerNear != undefined) {
            //sigo al player detectado
            var playerTileX = Math.round(playerNear.x / this.gridSize);
            var playerTileY = Math.round(playerNear.y / this.gridSize);
            var monsterMove = false;
            if (this.tileX > playerTileX + 1) {
                this.tileX -= 1;
                monsterMove = true;
            }
            else if (this.tileX < playerTileX - 1) {
                this.tileX += 1;
                monsterMove = true;
            }
            if (this.tileY > playerTileY + 1) {
                this.tileY -= 1;
                monsterMove = true;
            }
            else if (this.tileY < playerTileY - 1) {
                this.tileY += 1;
                monsterMove = true;
            }
            if (monsterMove) {
                this.socket.emit('monster move', { idMonster: this.monsterId, tileX: this.tileX, tileY: this.tileY });
            }
        }
        if (this.monsterDie == false) {
            var timerMove = setTimeout(function () { return _this.monsterMove(); }, 800);
        }
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
        if (this.monsterDie == false) {
            //controlo que jugador esta demasiado cerca de un moustro
            for (var idPlayer in this.controlPlayer.arrayPlayers) {
                var player = this.controlPlayer.arrayPlayers[idPlayer];
                var playerTileX = Math.round(player.x / this.gridSize);
                var playerTileY = Math.round(player.y / this.gridSize);
                var data;
                if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
                    Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
                    var randomAtack = Math.random();
                    if (randomAtack <= 0.8) {
                        //normal atack 
                        data = {
                            idMonster: this.monsterId,
                            idPlayer: player.playerId,
                            monsterAtackType: 0,
                            damage: player.calculateDamage(Math.round(Math.random() * this.monsterPower + 1)),
                            idSpell: 3,
                        };
                    }
                    else {
                        //especial mega atack!!
                        data = {
                            idMonster: this.monsterId,
                            idPlayer: player.playerId,
                            monsterAtackType: 1,
                            damage: player.calculateDamage(50),
                            tileX: playerTileX,
                            tileY: playerTileY,
                            spellSize: 150,
                            coolDownTimeSec: 1,
                            idSpell: 3,
                        };
                    }
                    this.socket.emit('monster hit', data);
                }
            }
            var timerAtack = setTimeout(function () { return _this.monsterAtack(); }, 1200);
        }
    };
    cServerMonster.prototype.sendMonsterToNewPlayer = function (socket) {
        socket.emit('new Monster', { id: this.monsterId, tileX: this.tileX, tileY: this.tileY });
    };
    return cServerMonster;
}());
exports.cServerMonster = cServerMonster;
