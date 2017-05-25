"use strict";
var cPlayer_1 = require('./cPlayer');
var cServerControlPlayers = (function () {
    function cServerControlPlayers(socket) {
        this.socket = socket;
        this.startTileX = 41;
        this.startTileY = 63;
        this.playersOnline = 0;
        this.arrayPlayers = [];
    }
    cServerControlPlayers.prototype.movePlayer = function (socketPlayer, data) {
        // Find player in array
        var movePlayer = this.getPlayerById(socketPlayer.id);
        // Player not found
        if (!movePlayer) {
            console.log('Player not found: ' + socketPlayer.id);
            return;
        }
        movePlayer.x = data.x;
        movePlayer.y = data.y;
        movePlayer.dirMov = data.dirMov;
        socketPlayer.broadcast.emit('move player', { id: movePlayer.playerId, x: movePlayer.x, y: movePlayer.y, dirMov: movePlayer.dirMov });
    };
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
    cServerControlPlayers.prototype.onNewPlayerConected = function (socket, data) {
        var idPlayer = socket.id;
        this.playersOnline += 1;
        socket.broadcast.emit('new player', { id: idPlayer, name: data.name, startTileX: this.startTileX, startTileY: this.startTileY, playersOnline: this.playersOnline });
        //le mando al nuevo jugador todos los jugadores existentes
        for (var id in this.arrayPlayers) {
            this.arrayPlayers[id].sendPlayerToNewPlayer(socket, this.playersOnline);
        }
        // Add new player to the players array
        this.arrayPlayers[idPlayer] = new cPlayer_1.cPlayer(socket, idPlayer, data.name, data.x, data.y, this.controlMonster);
    };
    cServerControlPlayers.prototype.onPlayerDisconected = function (socket) {
        delete this.arrayPlayers[socket.id];
        this.playersOnline -= 1;
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
    cServerControlPlayers.prototype.youChange = function (socketPlayer, data) {
        //lets see if player changes its name 
        if (data.name != null) {
            var player = this.getPlayerById(socketPlayer.id);
            if (player != null) {
                player.playerName = data.name;
                socketPlayer.broadcast.emit('player change', { id: socketPlayer.id, name: data.name });
            }
        }
    };
    cServerControlPlayers.prototype.spellCast = function (socketPlayer, data) {
        var _this = this;
        data.idPlayer = socketPlayer.id;
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
                    _this.socket.emit('someone hit monster', {
                        idMonster: monster.monsterId,
                        idPlayer: player.playerId,
                        damage: spellResult.monsterDamage,
                        idSpell: spellResult.spellAnimationMonster,
                        lifePercRemaining: monster.monsterLife / monster.monsterMaxLife
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
                                _this.controlMonster.createNewMonster(Math.round(Math.random() * _this.controlMonster.mapSizeX), Math.round(Math.random() * _this.controlMonster.mapSizeY), _this.randomIntFromInterval(1, 4), true);
                            }
                            else {
                                _this.controlMonster.createNewMonster(Math.round(Math.random() * _this.controlMonster.mapSizeX), Math.round(Math.random() * _this.controlMonster.mapSizeY), 5 /* Cosmic */, true);
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
    cServerControlPlayers.prototype.playerDie = function (socket, data) {
        var player = this.getPlayerById(socket.id);
        //primero envio al que mato su kill
        if (player != null) {
            var playerKill = this.getPlayerById(data.idPlayerKill);
            if (playerKill != null) {
                this.socket.emit('player die', { id: socket.id, idPlayerThatKill: playerKill.playerId, name: player.playerName, tileX: this.startTileX, tileY: this.startTileY });
            }
            else {
                this.socket.emit('player die', { id: socket.id, name: 'Monster', tileX: this.startTileX, tileY: this.startTileY });
            }
        }
    };
    return cServerControlPlayers;
}());
exports.cServerControlPlayers = cServerControlPlayers;
