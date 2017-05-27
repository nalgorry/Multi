var cControlPortal = (function () {
    function cControlPortal(controlGame) {
        this.controlGame = controlGame;
        this.createPortals();
    }
    cControlPortal.prototype.createPortals = function () {
        this.arrayPortals = new Array();
        var portal = new cPortal(this.controlGame, 2 /* fistMap */, 40, 30);
        this.arrayPortals['p' + 1] = portal;
    };
    //el servidor emite esto cuando entras al portal 
    cControlPortal.prototype.youEnterPortal = function (data) {
        this.controlGame.changeMap(data);
    };
    cControlPortal.prototype.checkPortals = function (tileX, tileY) {
        for (var idPortal in this.arrayPortals) {
            var portal = this.arrayPortals[idPortal];
            if ((tileX == portal.tileX || tileX == portal.tileX) && tileY == portal.tileY) {
                console.log("entro a un portal");
                this.controlGame.controlServer.socket.emit('enter portal', {
                    idPortal: portal.portalID,
                    name: 'Nuevo nombre',
                    x: 50,
                    y: 50
                });
                this.controlGame.resetMap();
            }
        }
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
