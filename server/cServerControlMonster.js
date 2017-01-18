"use strict";
var cServerMonster_1 = require('./cServerMonster');
var cServerControlMonster = (function () {
    function cServerControlMonster(socket, controlPlayer, controlItems) {
        this.socket = socket;
        this.controlPlayer = controlPlayer;
        this.controlItems = controlItems;
        this.nextIdMonster = 0;
        this.arrayMonster = [];
        //creo los primeros monters :)
        for (var i = 1; i <= 25; i++) {
            this.createNewMonster(Math.round(Math.random() * 76 + 14), Math.round(Math.random() * 76 + 14));
        }
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
    cServerControlMonster.prototype.createNewMonster = function (tileX, tileY) {
        var newMonster = new cServerMonster_1.cServerMonster(this.controlItems);
        newMonster.startMonster("m" + this.nextIdMonster, this.randomIntFromInterval(1, 4), this.socket, this.controlPlayer, tileX, tileY);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;
        this.nextIdMonster += 1;
    };
    cServerControlMonster.prototype.monsterHit = function (data, player) {
        //busco el moustro y le pego
        var monster = this.getMonsterById(data.idMonster);
        if (monster != undefined) {
            monster.monsterHit(data, player);
            //controlo si se murio el moustro y lo saco del array de moustros
            if (monster.monsterDie == true) {
                delete this.arrayMonster[data.idMonster];
                //creo un nuevo monster
                this.createNewMonster(Math.round(Math.random() * 76 + 14), Math.round(Math.random() * 76 + 12));
            }
        }
        else {
            console.log("monstruo no encontrado");
        }
    };
    cServerControlMonster.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return cServerControlMonster;
}());
exports.cServerControlMonster = cServerControlMonster;
