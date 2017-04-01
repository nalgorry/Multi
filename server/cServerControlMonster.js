"use strict";
var cServerMonster_1 = require('./cServerMonster');
var cServerControlMonster = (function () {
    function cServerControlMonster(socket, controlPlayer, controlItems) {
        this.socket = socket;
        this.controlPlayer = controlPlayer;
        this.controlItems = controlItems;
        this.nextIdMonster = 0;
        this.monsterMaxX = 65;
        this.monsterMaxY = 50;
        this.arrayMonster = [];
        //creo los primeros monters :)
        for (var i = 1; i <= 35; i++) {
            var randmType = this.randomIntFromInterval(1, 2);
            var monsterType = 1 /* FirstMonster */;
            if (randmType == 2) {
                var monsterType = 3 /* Wolf */;
            }
            this.createNewMonster(Math.round(Math.random() * this.monsterMaxX), Math.round(Math.random() * this.monsterMaxY), monsterType, true);
        }
        //creo el mounstro COSMICO
        this.createNewMonster(Math.round(Math.random() * this.monsterMaxX), Math.round(Math.random() * this.monsterMaxY), 5 /* Cosmic */, true);
        this.createNewMonster(Math.round(Math.random() * this.monsterMaxX), Math.round(Math.random() * this.monsterMaxY), 5 /* Cosmic */, true);
    }
    cServerControlMonster.prototype.getMonsterById = function (id) {
        return this.arrayMonster[id];
    };
    cServerControlMonster.prototype.onNewPlayerConected = function (socket) {
        //le mando al nuevo cliente todos los moustros del mapa
        for (var numMonster in this.arrayMonster) {
            var monster = this.arrayMonster[numMonster];
            //me fijo si el monstruo es publico antes de mandarlo 
            if (monster.isPublic == true) {
                monster.sendMonsterToNewPlayer(socket);
            }
        }
        //le mando el moustro para el tutorial solo a este jugador.
        var newMonster = new cServerMonster_1.cServerMonster(this.controlItems);
        newMonster.startMonster("m" + this.nextIdMonster, 1 /* FirstMonster */, socket, this.controlPlayer, false, false, 55, 59);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;
        this.nextIdMonster += 1;
    };
    cServerControlMonster.prototype.createNewMonster = function (tileX, tileY, monsterType, monsterRespawn) {
        var newMonster = new cServerMonster_1.cServerMonster(this.controlItems);
        newMonster.startMonster("m" + this.nextIdMonster, monsterType, this.socket, this.controlPlayer, monsterRespawn, true, tileX, tileY);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;
        this.nextIdMonster += 1;
    };
    cServerControlMonster.prototype.findMonstersInArea = function (centerTileX, centerTileY, tilesX, tilesY) {
        var resultado = [];
        for (var numMonster in this.arrayMonster) {
            var monster = this.arrayMonster[numMonster];
            if (Math.abs(monster.tileX - centerTileX) <= tilesX) {
                if (Math.abs(monster.tileY - centerTileY) <= tilesY) {
                    resultado.push(monster.monsterId);
                }
            }
        }
        return resultado;
    };
    cServerControlMonster.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return cServerControlMonster;
}());
exports.cServerControlMonster = cServerControlMonster;
