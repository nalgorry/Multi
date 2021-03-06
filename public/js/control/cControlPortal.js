var cControlPortal = (function () {
    function cControlPortal(controlGame) {
        this.controlGame = controlGame;
        this.arrayPortals = [];
    }
    cControlPortal.prototype.resetPortals = function () {
        this.arrayPortals = new Array();
    };
    //this is get from the server
    cControlPortal.prototype.youEnterPortal = function (data) {
    };
    //this is get from the server 
    cControlPortal.prototype.newPortals = function (data) {
        var _this = this;
        data.forEach(function (portalData) {
            var portal = new cPortal(_this.controlGame, portalData.idPortal, portalData.x, portalData.y, portalData.newMapTileX, portalData.newMapTileY, portalData.mapName, portalData.pvspAllowed, portalData.active);
            _this.arrayPortals.push(portal);
        });
    };
    cControlPortal.prototype.checkPortals = function (tileX, tileY) {
        var _this = this;
        this.arrayPortals.forEach(function (portal) {
            if ((tileX == portal.tileX || tileX == portal.tileX) && tileY == portal.tileY && portal.active == true) {
                _this.controlGame.controlServer.socket.emit('enter portal', {
                    idPortal: portal.portalID,
                    name: _this.controlGame.controlPlayer.playerName,
                    x: portal.newMapTileX,
                    y: portal.newMapTileY
                });
                _this.controlGame.resetMap(portal.newMapTileX, portal.newMapTileY);
                _this.controlGame.changeMap(portal.mapName, portal.portalID, portal.pvspAllowed);
                _this.controlGame.controlMissions.loadMision(portal.portalID);
            }
        });
    };
    return cControlPortal;
}());
var cPortal = (function () {
    function cPortal(controlGame, portalID, tileX, tileY, newMapTileX, newMapTileY, mapName, pvspAllowed, active) {
        this.controlGame = controlGame;
        this.portalID = portalID;
        this.tileX = tileX;
        this.tileY = tileY;
        this.newMapTileX = newMapTileX;
        this.newMapTileY = newMapTileY;
        this.mapName = mapName;
        this.pvspAllowed = pvspAllowed;
        this.active = active;
        var gridSize = this.controlGame.gridSize;
        var sprite = this.controlGame.game.add.sprite(tileX * gridSize + gridSize / 2, tileY * gridSize + gridSize / 2, 'portal');
        sprite.anchor.set(0.5);
        if (active == true) {
            sprite.animations.add('portalOn', [1, 2, 3, 4], 8, true);
            sprite.animations.play('portalOn');
        }
        else {
            sprite.animations.add('portalOff', [0], 8, true);
            sprite.animations.play('portalOff');
        }
        this.controlGame.depthGroup.add(sprite);
    }
    return cPortal;
}());
