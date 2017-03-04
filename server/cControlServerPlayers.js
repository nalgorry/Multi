"use strict";
var cPlayer_1 = require('./cPlayer');
var cServerControlPlayers = (function () {
    function cServerControlPlayers(socket) {
        this.socket = socket;
        this.arrayPlayers = [];
    }
    cServerControlPlayers.prototype.levelUp = function (socket, data) {
        // Find player in array
        var player = this.getPlayerById(socket.id);
        // Player not found
        if (player == undefined) {
            console.log('Player not found: ' + socket.id);
            return;
        }
        player.levelUp(data);
    };
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
        this.arrayPlayers[idPlayer] = new cPlayer_1.cPlayer(socket, idPlayer, data.name, data.x, data.y, this.controlMonster);
    };
    cServerControlPlayers.prototype.onPlayerDisconected = function (socket) {
        delete this.arrayPlayers[socket.id];
    };
    cServerControlPlayers.prototype.youEquipItem = function (socket, data) {
        // Find player in array
        var player = this.getPlayerById(socket.id);
        // Player not found
        if (player == undefined) {
            console.log('Player not found: ' + socket.id);
            return;
        }
        player.equipItems(data);
    };
    cServerControlPlayers.prototype.spellCast = function (data) {
        var _this = this;
        var player = this.getPlayerById(data.idPlayer);
        if (player != null) {
            //calculo el efecto del hechizo, esto me dice que daño hace y a quien afecta
            var spellResult = player.spellResult(data);
            //ataco todos los monstruos afectados por el hechizo
            spellResult.monsterTargets.forEach(function (idMonster) {
                //busco el moustro y le pego
                var monster = _this.controlMonster.getMonsterById(idMonster);
                if (monster != undefined) {
                    monster.monsterHit(data, spellResult.monsterDamage, player.playerId);
                    player.socket.emit('you hit monster', { idMonster: monster.monsterId,
                        damage: spellResult.monsterDamage,
                        idSpell: spellResult.spellAnimationMonster
                    });
                    //controlo si se murio el moustro y lo saco del array de moustros
                    if (monster.monsterDie == true) {
                        _this.socket.emit('monster die', { idMonster: monster.monsterId,
                            idPlayer: player.playerId,
                            experience: monster.experience });
                        delete _this.controlMonster.arrayMonster[monster.monsterId];
                        //TODO sacar esto de aca... creo un nuevo monster aleatorio, excepto el cosmico que lo creo de nuevo
                        if (monster.monsterRespawn == true) {
                            if (monster.monsterType != 5 /* Cosmic */) {
                                _this.controlMonster.createNewMonster(Math.round(Math.random() * _this.controlMonster.monsterMaxX), Math.round(Math.random() * _this.controlMonster.monsterMaxY), _this.randomIntFromInterval(1, 4), true);
                            }
                            else {
                                _this.controlMonster.createNewMonster(Math.round(Math.random() * _this.controlMonster.monsterMaxX), Math.round(Math.random() * _this.controlMonster.monsterMaxY), 5 /* Cosmic */, true);
                            }
                        }
                    }
                }
                else {
                    console.log("monstruo no encontrado: " + idMonster);
                }
            });
            //analizo todos los otros jugadores afectados 
            spellResult.playerTargets.forEach(function (idPlayer) {
                var playerHit = _this.getPlayerById(idPlayer);
                if (playerHit != null) {
                    var damage = playerHit.calculateDamage(spellResult.playerDamage); //calculo el daño restando la defensa y demas 
                    // mando el golpe a los jugadores
                    _this.socket.emit('player hit', { id: playerHit.playerId,
                        playerThatHit: player.playerId,
                        x: player.x,
                        y: player.y,
                        damage: damage,
                        idSpell: spellResult.spellAnimationPlayer });
                }
            });
        }
        else {
            console.log("usuario no entrado");
        }
    };
    cServerControlPlayers.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return cServerControlPlayers;
}());
exports.cServerControlPlayers = cServerControlPlayers;
