var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cOtherPlayer = (function (_super) {
    __extends(cOtherPlayer, _super);
    function cOtherPlayer(controlGame, data) {
        _super.call(this, controlGame);
        this.idServer = data.id;
        this.tileX = this.controlGame.layer.getTileX(data.x);
        this.tileY = this.controlGame.layer.getTileY(data.y);
        this.startActor(); //esto inicia todo el jugador con sus elementos
        this.startPlayer(data);
    }
    cOtherPlayer.prototype.startPlayer = function (data) {
        this.armorSprite.inputEnabled = true;
        this.armorSprite.events.onInputDown.add(this.youHitPlayer, this);
        this.setNameText(data.name);
        this.startAnimation('idle_right');
    };
    cOtherPlayer.prototype.MoverJugador = function (data) {
        this.moveTween = this.controlGame.game.add.tween(this.playerSprite).to({ x: data.x, y: data.y }, 320, Phaser.Easing.Linear.None, true, 0);
        console.log(data.dirMov);
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
        else if (data.dirMov == move.idleLeft) {
            this.moveTween.onComplete.add(this.resetAnimation, this, undefined, move.idleLeft);
        }
        else if (data.dirMov == move.idleRight) {
            this.moveTween.onComplete.add(this.resetAnimation, this, undefined, move.idleRight);
        }
        this.tileX = this.controlGame.layer.getTileX(data.x);
        this.tileY = this.controlGame.layer.getTileY(data.y);
    };
    cOtherPlayer.prototype.resetAnimation = function (sprite, tween, dir) {
        if (dir == move.idleLeft) {
            this.startAnimation('idle_left');
        }
        else {
            this.startAnimation('idle_right');
        }
    };
    cOtherPlayer.prototype.youHitPlayer = function () {
        this.controlGame.controlPlayer.controlSpells.otherPlayerClick(this);
    };
    cOtherPlayer.prototype.removePlayer = function () {
        //borro el focus
        this.controlGame.controlPlayer.controlSpells.releaseFocus(this.idServer);
        this.playerSprite.kill();
    };
    return cOtherPlayer;
}(cBasicActor));
