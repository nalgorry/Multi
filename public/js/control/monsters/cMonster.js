var cMonster = (function () {
    function cMonster(controlGame, data) {
        this.idMonster = data.id;
        this.tileX = data.x;
        this.tileY = data.y;
        this.startMonster(data);
    }
    cMonster.prototype.startMonster = function (data) {
    };
    return cMonster;
}());
