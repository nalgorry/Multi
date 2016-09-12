var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cOtherPlayer = (function (_super) {
    __extends(cOtherPlayer, _super);
    function cOtherPlayer(controlGame, data) {
        _super.call(this, controlGame);
        this.id = data.id;
        this.tileX = data.x;
        this.tileY = data.y;
        this.startActor(); //esto inicia todo el jugador con sus elementos
        this.startPlayer();
    }
    cOtherPlayer.prototype.startPlayer = function () {
        this.playerSprite.inputEnabled = true;
        this.playerSprite.events.onInputDown.add(this.youHitPlayer, this);
        this.startAnimation('idle');
    };
    cOtherPlayer.prototype.MoverJugador = function (data) {
        console.log(data);
        this.moveTween = this.controlGame.game.add.tween(this.playerSprite).to({ x: data.x * this.controlGame.gridSize + this.playerSprite.width / 2, y: data.y * this.controlGame.gridSize }, 320, Phaser.Easing.Linear.None, true, 0);
        this.moveTween.onComplete.add(this.resetAnimation, this);
        this.idleStatus = false;
        if (data.dirMov == move.right) {
            this.startAnimation('right');
        }
        else if (data.dirMov == move.left) {
            this.startAnimation('left');
        }
        else if (data.dirMov == move.up) {
            this.startAnimation('up');
        }
        else if (data.dirMov == move.down) {
            this.startAnimation('down');
        }
        else if (data.dirMov == move.idle) {
            this.idleStatus = true;
        }
        this.tileX = data.x;
        this.tileY = data.y;
    };
    cOtherPlayer.prototype.resetAnimation = function () {
        if (this.idleStatus == true) {
            this.startAnimation('idle');
        }
    };
    cOtherPlayer.prototype.youHitPlayer = function () {
        this.controlGame.controlPlayer.controlSpells.otherPlayerClick(this);
    };
    cOtherPlayer.prototype.removePlayer = function () {
        this.playerSprite.kill();
    };
    return cOtherPlayer;
}(cBasicActor));
