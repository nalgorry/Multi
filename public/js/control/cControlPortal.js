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
        this.controlGame.changeMap(data);
    };
    //this is get from the server 
    cControlPortal.prototype.newPortals = function (data) {
        var _this = this;
        data.forEach(function (portalData) {
            var portal = new cPortal(_this.controlGame, portalData.idPortal, portalData.x, portalData.y);
            _this.arrayPortals.push(portal);
        });
    };
    cControlPortal.prototype.checkPortals = function (tileX, tileY) {
        var _this = this;
        this.arrayPortals.forEach(function (portal) {
            if ((tileX == portal.tileX || tileX == portal.tileX) && tileY == portal.tileY) {
                console.log("entro a un portal");
                _this.controlGame.controlServer.socket.emit('enter portal', {
                    idPortal: portal.portalID,
                    name: 'Nuevo nombre',
                    x: 50,
                    y: 50
                });
                _this.controlGame.resetMap();
            }
        });
    };
    return cControlPortal;
}());
var cPortal = (function () {
    function cPortal(controlGame, portalID, tileX, tileY) {
        this.controlGame = controlGame;
        this.portalID = portalID;
        this.tileX = tileX;
        this.tileY = tileY;
        var gridSize = this.controlGame.gridSize;
        var sprite = this.controlGame.game.add.sprite(tileX * gridSize, tileY * gridSize, 'portal');
        sprite.anchor.y = 1;
        this.controlGame.depthGroup.add(sprite);
    }
    return cPortal;
}());
