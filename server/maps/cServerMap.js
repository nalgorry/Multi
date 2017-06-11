"use strict";
var cServerPortals_1 = require('./cServerPortals');
var cServerMonster_1 = require('./../cServerMonster');
var cServerMap = (function () {
    function cServerMap(JSONMapData) {
        var _this = this;
        this.arrayPortals = [];
        this.arrayMonster = [];
        this.id = JSONMapData.id;
        this.mapName = JSONMapData.mapName;
        this.file = JSONMapData.file;
        this.monsterNumber = JSONMapData.monsterNumber;
        //lets add the portals to the map
        if (JSONMapData.portals != undefined) {
            JSONMapData.portals.forEach(function (portal) {
                _this.arrayPortals.push(new cServerPortals_1.cServerPortals(portal.idPortal, portal.x, portal.y, portal.newMapTileX, portal.newMapTileY));
            });
            //lets get the fixed moster for the map
            if (JSONMapData.monsters != undefined) {
                JSONMapData.monsters.forEach(function (monsterData) {
                    var monster = new cServerMonster_1.cServerMonster();
                    monster.defineMonster(monsterData.monsterType, monsterData.monsterRespawn, monsterData.isPublic, monsterData.tileX, monsterData.tileY);
                    _this.arrayMonster.push(monster);
                    console.log(_this.arrayMonster);
                });
            }
        }
    }
    return cServerMap;
}());
exports.cServerMap = cServerMap;
