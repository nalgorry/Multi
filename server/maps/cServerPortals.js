"use strict";
var cServerPortals = (function () {
    function cServerPortals(idPortal, x, y, newMapTileX, newMapTileY, active) {
        this.idPortal = idPortal;
        this.x = x;
        this.y = y;
        this.newMapTileX = newMapTileX;
        this.newMapTileY = newMapTileY;
        this.active = active;
    }
    return cServerPortals;
}());
exports.cServerPortals = cServerPortals;
