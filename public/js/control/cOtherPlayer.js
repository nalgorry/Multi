var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cOtherPlayer = (function (_super) {
    __extends(cOtherPlayer, _super);
    function cOtherPlayer() {
        _super.apply(this, arguments);
    }
    cOtherPlayer.prototype.IniciarJugador = function () {
        this.playerSprite = this.controlGame.game.add.sprite(this.tileX * this.controlGame.gridSize, this.tileY * this.controlGame.gridSize, 'player');
        this.playerSprite.anchor.set(0.5);
        this.playerSprite.x += this.playerSprite.width / 2;
        this.controlGame.game.physics.arcade.enable(this.playerSprite);
        this.playerSprite.body.collideWorldBounds = true;
        this.playerSprite.inputEnabled = true;
        this.playerSprite.events.onInputDown.add(this.youHitPlayer, this);
        this.controlGame.depthGroup.add(this.playerSprite);
    };
    cOtherPlayer.prototype.MoverJugador = function (data) {
        this.controlGame.game.add.tween(this.playerSprite).to({ x: data.x * this.controlGame.gridSize + this.playerSprite.width / 2 }, 350, Phaser.Easing.Linear.None, true, 0);
        this.controlGame.game.add.tween(this.playerSprite).to({ y: data.y * this.controlGame.gridSize }, 350, Phaser.Easing.Linear.None, true, 0);
        //this.playerSprite.frame = data.dirMov;
    };
    cOtherPlayer.prototype.youHitPlayer = function () {
        if (this.controlGame.atackMode == true) {
            this.controlGame.controlServer.socket.emit('player click', { idPlayerHit: this.id });
            this.controlGame.game.canvas.style.cursor = 'default';
        }
    };
    cOtherPlayer.prototype.removePlayer = function () {
        this.playerSprite.kill();
    };
    return cOtherPlayer;
}(cBasicActor));
