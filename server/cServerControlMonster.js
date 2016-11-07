"use strict";
var cServerMonster_1 = require('./cServerMonster');
var cServerControlMonster = (function () {
    function cServerControlMonster(socket, controlPlayer) {
        this.socket = socket;
        this.controlPlayer = controlPlayer;
        this.nextIdMonster = 0;
        this.arrayMonster = [];
        //creo los primeros monters :)
        this.createNewMonster(50, 10, 10);
        this.createNewMonster(50, 30, 30);
        this.createNewMonster(50, 10, 30);
    }
    cServerControlMonster.prototype.getMonsterById = function (id) {
        return this.arrayMonster[id];
    };
    cServerControlMonster.prototype.onNewPlayerConected = function (socket) {
        //le mando al nuevo cliente todos los moustros del mapa
        for (var monster in this.arrayMonster) {
            this.arrayMonster[monster].sendMonsterToNewPlayer(socket);
        }
    };
    cServerControlMonster.prototype.createNewMonster = function (life, tileX, tileY) {
        var newMonster = new cServerMonster_1.cServerMonster("m" + this.nextIdMonster, this.socket, this.controlPlayer);
        newMonster.startMonster(life, tileX, tileY);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;
        this.nextIdMonster += 1;
    };
    cServerControlMonster.prototype.monsterHit = function (data, player) {
        //busco el moustro y le pego
        var monster = this.getMonsterById(data.idMonster);
        if (monster != null) {
            monster.monsterHit(data, player);
        }
        else {
            console.log("monstruo no encontrado");
        }
        //controlo si se murio el moustro y lo saco del array de moustros
        if (monster.monsterDie == true) {
            delete this.arrayMonster[data.idMonster];
            //creo un nuevo monster
            this.createNewMonster(50, Math.round(Math.random() * 30 + 10), Math.round(Math.random() * 30 + 10));
            this.createNewMonster(50, Math.round(Math.random() * 30 + 10), Math.round(Math.random() * 30 + 10));
        }
    };
    return cServerControlMonster;
}());
exports.cServerControlMonster = cServerControlMonster;
