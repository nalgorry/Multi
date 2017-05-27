"use strict";
var cServerMap = (function () {
    function cServerMap(JSONMapData) {
        this.arrayPortals = [];
        this.id = JSONMapData.id;
        this.name = JSONMapData.name;
        this.file = JSONMapData.file;
        this.monsterNumber = JSONMapData.monsterNumber;
    }
    return cServerMap;
}());
exports.cServerMap = cServerMap;
