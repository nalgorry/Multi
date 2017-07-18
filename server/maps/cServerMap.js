"use strict";
var cServerPortals_1 = require('./cServerPortals');
var cServerMonster_1 = require('./../cServerMonster');
var cServerItems_1 = require('./../items/cServerItems');
var cServerMap = (function () {
    function cServerMap(JSONMapData) {
        var _this = this;
        this.arrayPortals = [];
        this.arrayMonster = [];
        this.arrayItems = [];
        this.arrayMonsterTypes = [];
        this.id = JSONMapData.id;
        this.mapName = JSONMapData.mapName;
        this.file = JSONMapData.file;
        this.monsterNumber = JSONMapData.monsterNumber;
        this.arrayMonsterTypes = JSONMapData.monsterTypes;
        this.pvspAllowed = JSONMapData.PvsPAlowed;
        //lets add the portals to the map
        if (JSONMapData.portals != undefined) {
            JSONMapData.portals.forEach(function (portal) {
                _this.arrayPortals.push(new cServerPortals_1.cServerPortals(portal.idPortal, portal.x, portal.y, portal.newMapTileX, portal.newMapTileY, portal.active));
            });
        }
        //lets get the fixed moster for the map
        if (JSONMapData.monsters != undefined) {
            JSONMapData.monsters.forEach(function (monsterData) {
                var monster = new cServerMonster_1.cServerMonster();
                monster.defineMonster(monsterData.monsterType, monsterData.monsterRespawn, monsterData.isPublic, monsterData.tileX, monsterData.tileY);
                _this.arrayMonster.push(monster);
            });
        }
        //lets add the items of the map! NICE :)
        if (JSONMapData.items != undefined) {
            JSONMapData.items.forEach(function (itemData) {
                var item = new cServerItems_1.cServerItems();
                item.defineItem(itemData.itemType, itemData.itemLevel, itemData.tileX, itemData.tileY, itemData.isPublic);
                _this.arrayItems.push(item);
            });
        }
    }
    return cServerMap;
}());
exports.cServerMap = cServerMap;
