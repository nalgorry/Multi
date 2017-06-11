"use strict";
var cServerMonster_1 = require('./cServerMonster');
var cServerControlMonster = (function () {
    function cServerControlMonster(socket, room, controlPlayer, controlItems, monsterNumber, mapName, arrayMonsters) {
        var _this = this;
        this.socket = socket;
        this.room = room;
        this.controlPlayer = controlPlayer;
        this.controlItems = controlItems;
        this.monsterNumber = monsterNumber;
        this.mapName = mapName;
        this.arrayMonsters = arrayMonsters;
        this.nextIdMonster = 0;
        this.mapSizeX = 70;
        this.mapSizeY = 50; //to avoid monster in the city
        this.arrayMonster = [];
        //get the tiles where monsters can not move
        this.getMapHitTest(mapName);
        //create the random monsters.
        for (var i = 1; i <= monsterNumber; i++) {
            var randmType = this.randomIntFromInterval(1, 2);
            var monsterType = 1 /* FirstMonster */;
            if (randmType == 2) {
                var monsterType = 3 /* Wolf */;
            }
            this.createNewMonster(undefined, undefined, monsterType, true);
        }
        arrayMonsters.forEach(function (monster) {
            _this.createNewMonster(monster.tileX, monster.tileY, monster.monsterType, monster.monsterRespawn);
        });
    }
    cServerControlMonster.prototype.getMapHitTest = function (mapFile) {
        //lets get the file with the map to avoid monster to hit the water
        var fs = require('fs');
        //to make it work local and in heroku 
        var file = "public/assets/maps/" + mapFile;
        if (!fs.existsSync(file)) {
            console.log("File not found");
            file = "../public/assets/maps/" + mapFile;
        }
        var mapData = JSON.parse(fs.readFileSync(file, 'utf8'));
        this.arrayMonsterHit = new Array();
        this.arrayMonsterHit = mapData.layers[4].data;
    };
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
    };
    cServerControlMonster.prototype.createNewMonster = function (tileX, tileY, monsterType, monsterRespawn) {
        var newMonster = new cServerMonster_1.cServerMonster();
        newMonster.defineMonster(monsterType, monsterRespawn, true, tileX, tileY);
        newMonster.startMonster("m" + this.nextIdMonster, this.socket, this.controlPlayer, this.controlItems, this.room, this.arrayMonsterHit, this.mapSizeX, this.mapSizeY);
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
