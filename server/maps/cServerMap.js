"use strict";
var cServerPortals_1 = require('./cServerPortals');
var cServerMap = (function () {
    function cServerMap(JSONMapData) {
        var _this = this;
        this.arrayPortals = [];
        this.id = JSONMapData.id;
        this.mapName = JSONMapData.mapName;
        this.file = JSONMapData.file;
        this.monsterNumber = JSONMapData.monsterNumber;
        //lets add the portals to the map
        if (JSONMapData.portals != undefined) {
            JSONMapData.portals.forEach(function (portal) {
                _this.arrayPortals.push(new cServerPortals_1.cServerPortals(portal.idPortal, portal.x, portal.y, portal.newMapTileX, portal.newMapTileY));
            });
        }
    }
    return cServerMap;
}());
exports.cServerMap = cServerMap;
