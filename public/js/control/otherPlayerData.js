var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cOtherPlayerData = (function (_super) {
    __extends(cOtherPlayerData, _super);
    function cOtherPlayerData() {
        _super.apply(this, arguments);
    }
    cOtherPlayerData.prototype.IniciarJugador = function () {
        this.playerSprite = this.controlGame.game.add.sprite(this.tileX * this.controlGame.gridSize, this.tileY * this.controlGame.gridSize, 'player');
        this.playerSprite.anchor.set(0, 0.5);
        this.controlGame.game.physics.arcade.enable(this.playerSprite);
        this.playerSprite.body.collideWorldBounds = true;
        this.controlGame.depthGroup.add(this.playerSprite);
    };
    cOtherPlayerData.prototype.MoverJugador = function (data) {
        this.controlGame.game.add.tween(this.playerSprite).to({ x: data.x * this.controlGame.gridSize }, 350, Phaser.Easing.Linear.None, true, 0);
        this.controlGame.game.add.tween(this.playerSprite).to({ y: data.y * this.controlGame.gridSize }, 350, Phaser.Easing.Linear.None, true, 0);
        this.playerSprite.frame = data.dirMov;
    };
    cOtherPlayerData.prototype.removePlayer = function () {
        this.playerSprite.kill();
    };
    return cOtherPlayerData;
}(cPlayerData));
