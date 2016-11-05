var cMonster = (function () {
    function cMonster(controlGame, data) {
        this.controlGame = controlGame;
        this.monsterAtackTilesX = 13;
        this.monsterAtackTilesY = 9;
        this.idMonster = data.id;
        this.tileX = data.tileX;
        this.tileY = data.tileY;
        this.startMonster(data);
    }
    cMonster.prototype.startMonster = function (data) {
        var _this = this;
        //creo el moustro
        this.monsterSprite = this.controlGame.game.add.sprite(this.tileX * this.controlGame.gridSize, this.tileY * this.controlGame.gridSize, 'monster_1', 0);
        this.monsterSprite.anchor.set(0, 1);
        this.controlGame.depthGroup.add(this.monsterSprite);
        var timer = setTimeout(function () { return _this.simulateMonsterAtack(); }, 1200);
    };
    cMonster.prototype.simulateMonsterAtack = function () {
        var _this = this;
        var playerTileX = this.controlGame.controlPlayer.tileX;
        var playerTileY = this.controlGame.controlPlayer.tileY;
        if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
            Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
            var data = {
                damage: 5,
                idSpell: 4,
            };
            this.controlGame.controlPlayer.playerHit(data);
        }
        var timer = setTimeout(function () { return _this.simulateMonsterAtack(); }, 650);
    };
    cMonster.prototype.monsterAtack = function (data) {
        //me fijo a quien ataco el monstro 
        if (data.idPlayer == this.controlGame.controlPlayer.idServer) {
        }
    };
    return cMonster;
}());
