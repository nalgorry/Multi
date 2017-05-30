"use strict";
var cServerDefinitionMonsters_1 = require('./cServerDefinitionMonsters');
var cServerMonster = (function () {
    function cServerMonster(controlItems, room, arrayMonsterHit, mapSizeX, mapSizeY) {
        this.controlItems = controlItems;
        this.room = room;
        this.arrayMonsterHit = arrayMonsterHit;
        this.mapSizeX = mapSizeX;
        this.mapSizeY = mapSizeY;
        this.monsterDie = false; //para chekear si el moustro se murio o no
        this.specialAtackPercent = 0; //porcentaje de que lance el hechizo especial
        this.agresiveMonster = false; //determina si el moustro ataca por defecto o solo si lo atacan 
        this.arrayAgresivePlayers = [];
        this.experience = 0;
        //variables para definir el ataque
        this.gridSize = 40;
        this.monsterAtackTilesX = 13;
        this.monsterAtackTilesY = 9;
    }
    cServerMonster.prototype.startMonster = function (monsterId, monsterType, socket, controlPlayer, monsterRespawn, isPublic, tileX, tileY) {
        var _this = this;
        this.monsterId = monsterId;
        //lets check if the monster x y is allowed, if not we reset it
        while (this.checkMonsterCanMove(tileX, tileY) == false) {
            tileX = this.randomIntFromInterval(0, this.mapSizeX);
            tileY = this.randomIntFromInterval(0, this.mapSizeY);
        }
        this.socket = socket;
        this.controlPlayer = controlPlayer;
        this.tileX = tileX;
        this.tileY = tileY;
        this.monsterRespawn = monsterRespawn;
        this.isPublic = isPublic;
        //valores que dependen del tipo de monstruo
        this.monsterType = monsterType;
        cServerDefinitionMonsters_1.cServerDefinitionMonsters.defineMonsters(this, monsterType);
        this.monsterMaxLife = this.monsterLife;
        this.emitNewMonster();
        var timerAtack = setTimeout(function () { return _this.monsterAtack(); }, 1200);
        var timerMove = setTimeout(function () { return _this.monsterMove(); }, 800);
    };
    cServerMonster.prototype.checkMonsterCanMove = function (monsterX, monsterY) {
        var result;
        var arrayPoss = monsterY * this.mapSizeX + monsterX;
        //lets check if the map has a arrayMonsterHit to test
        if (this.arrayMonsterHit == undefined) {
            return true;
        }
        if (this.arrayMonsterHit[arrayPoss] != 0) {
            result = false;
        }
        else {
            result = true;
        }
        return result;
    };
    cServerMonster.prototype.emitNewMonster = function () {
        //emito el monstruo, si viene un socket es porque es un jugador nuevo y le mando solo a el los monstruos que ya existen
        var monsterdata = { id: this.monsterId,
            tileX: this.tileX,
            tileY: this.tileY,
            monsterType: this.monsterType };
        this.socket.in(this.room).emit('new Monster', monsterdata);
    };
    cServerMonster.prototype.emitMonsterToNewPlayer = function (socketPlayer) {
        //emito el monstruo, si viene un socket es porque es un jugador nuevo y le mando solo a el los monstruos que ya existen
        var monsterdata = { id: this.monsterId,
            tileX: this.tileX,
            tileY: this.tileY,
            monsterType: this.monsterType };
        socketPlayer.emit('new Monster', monsterdata);
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
            //me fijo si el moustro es pacifico, y si no ya salgo de esta funcion
            if (this.arrayAgresivePlayers[idPlayer] == undefined && this.agresiveMonster == false) {
                continue;
            }
            //me fijo si el jugador esta cerca del monstruo
            if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
                Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
                playerNear = player;
                break;
            }
        }
        var newTileX;
        var newTileY;
        if (playerNear != undefined) {
            //sigo al player detectado
            var playerTileX = Math.round(playerNear.x / this.gridSize);
            var playerTileY = Math.round(playerNear.y / this.gridSize);
            var monsterMove = false;
            if (this.tileX > playerTileX + 1) {
                newTileX = this.tileX - 1;
                monsterMove = true;
            }
            else if (this.tileX < playerTileX - 1) {
                newTileX = this.tileX + 1;
                monsterMove = true;
            }
            if (this.tileY > playerTileY + 1) {
                newTileY = this.tileY - 1;
                monsterMove = true;
            }
            else if (this.tileY < playerTileY - 1) {
                newTileY = this.tileY + 1;
                monsterMove = true;
            }
            //monster try to follow a playerId
            if (monsterMove) {
                var monsterCanMove = false;
                //lets check if the monster can follow the player
                if (this.checkMonsterCanMove(newTileX, this.tileY) == true) {
                    this.tileX = newTileX;
                    monsterCanMove = true;
                }
                if (this.checkMonsterCanMove(this.tileX, newTileY) == true) {
                    this.tileY = newTileY;
                    monsterCanMove = true;
                }
                if (monsterCanMove) {
                    this.socket.in(this.room).emit('monster move', { idMonster: this.monsterId, tileX: this.tileX, tileY: this.tileY });
                }
            }
        }
        if (this.monsterDie == false) {
            var timerMove = setTimeout(function () { return _this.monsterMove(); }, 800);
        }
    };
    cServerMonster.prototype.monsterHit = function (data, damage, idPlayer) {
        this.monsterLife -= damage;
        this.arrayAgresivePlayers[idPlayer] = true;
        //controlo si se murio el moustro 
        if (this.monsterLife <= 0) {
            this.monsterDie = true;
            this.monsterLife = 0;
            //creo un item para que tire el monstruo
            this.controlItems.createNewRandomItem(this.monsterItemLevelDrop, this.tileX, this.tileY);
        }
    };
    cServerMonster.prototype.monsterAtack = function () {
        var _this = this;
        if (this.monsterDie == false) {
            var playerNear;
            //controlo que jugador esta demasiado cerca de un moustro
            for (var idPlayer in this.controlPlayer.arrayPlayers) {
                var player = this.controlPlayer.arrayPlayers[idPlayer];
                var playerTileX = Math.round(player.x / this.gridSize);
                var playerTileY = Math.round(player.y / this.gridSize);
                var data;
                //me fijo si el moustro es pacifico, y si no ya salgo de esta funcion
                if (this.arrayAgresivePlayers[idPlayer] == undefined && this.agresiveMonster == false) {
                    continue;
                }
                //me fijo si el jugador esta cerca del monstruo
                if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
                    Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
                    playerNear = player;
                    var randomAtack = Math.random();
                    if (randomAtack >= this.specialAtackPercent) {
                        //normal atack 
                        data = {
                            idMonster: this.monsterId,
                            idPlayer: player.playerId,
                            monsterAtackType: 0,
                            damage: player.calculateDamage(Math.round(Math.random() * this.randomPower + 1) + this.fixPower),
                            idSpell: 1 /* BasicAtack */,
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
                            idSpell: 1 /* BasicAtack */,
                        };
                    }
                    this.socket.in(this.room).emit('monster hit', data);
                }
            }
            var timerAtack = setTimeout(function () { return _this.monsterAtack(); }, 1200);
        }
    };
    cServerMonster.prototype.sendMonsterToNewPlayer = function (socketPlayer) {
        this.emitMonsterToNewPlayer(socketPlayer);
    };
    cServerMonster.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return cServerMonster;
}());
exports.cServerMonster = cServerMonster;
