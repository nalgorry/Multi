"use strict";
var cServerPortals = (function () {
    function cServerPortals(idPortal, x, y, newMapTileX, newMapTileY) {
        this.idPortal = idPortal;
        this.x = x;
        this.y = y;
        this.newMapTileX = newMapTileX;
        this.newMapTileY = newMapTileY;
    }
    return cServerPortals;
}());
exports.cServerPortals = cServerPortals;
