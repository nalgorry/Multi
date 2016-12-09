var cControlPortal = (function () {
    function cControlPortal(controlGame) {
        this.controlGame = controlGame;
        this.createPortals();
    }
    cControlPortal.prototype.createPortals = function () {
        this.arrayPortals = new Array();
        var portal = new cPortal(this.controlGame, 1, 50, 4);
        this.arrayPortals.push(portal);
    };
    cControlPortal.prototype.checkPortals = function (tileX, tileY) {
        console.log(tileX);
        console.log(tileY);
        for (var _i = 0, _a = this.arrayPortals; _i < _a.length; _i++) {
            var portal = _a[_i];
            if ((tileX == portal.tileX || tileX == portal.tileX + 1) && tileY + 1 == portal.tileY) {
                console.log("ENTRO AL MEGA SUPER PORTAL");
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
        console.log(sprite.y);
        this.controlGame.depthGroup.add(sprite);
    }
    return cPortal;
}());
