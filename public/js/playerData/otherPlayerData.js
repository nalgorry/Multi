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
        this.playerSprite = this.game.add.sprite(this.tileX * 32 + 16, this.tileY * 32 + 16, 'player');
        this.playerSprite.anchor.set(0.5);
        this.game.physics.arcade.enable(this.playerSprite);
        this.playerSprite.body.collideWorldBounds = true;
    };
    cOtherPlayerData.prototype.MoverJugador = function (data) {
        this.game.add.tween(this.playerSprite).to({ x: data.x * 32 + 16 }, 230, Phaser.Easing.Linear.None, true, 0);
        this.game.add.tween(this.playerSprite).to({ y: data.y * 32 + 16 }, 230, Phaser.Easing.Linear.None, true, 0);
    };
    cOtherPlayerData.prototype.removePlayer = function () {
        this.playerSprite.kill();
    };
    return cOtherPlayerData;
}(cPlayerData));
