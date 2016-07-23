var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cControlPlayer = (function (_super) {
    __extends(cControlPlayer, _super);
    function cControlPlayer() {
        _super.call(this);
        this.speedplayer = 150;
        this.lastMoveX = 0;
        this.lastMoveY = 0;
        this.gridSize = 50;
    }
    cControlPlayer.prototype.startPlayer = function () {
        this.playerSprite = this.game.add.sprite(0, 0, 'player');
        this.playerSprite.anchor.set(0.5);
        this.game.physics.arcade.enable(this.playerSprite);
        this.playerSprite.body.collideWorldBounds = true;
        this.playerSprite.body.width = 50;
        this.playerSprite.body.height = 50;
        this.playerSprite.body.offset.y = this.playerSprite.height - 50;
        this.life = 100; //esto vendria de algun server no?
        this.game.camera.follow(this.playerSprite);
        console.log(this.playerSprite);
    };
    cControlPlayer.prototype.playerHit = function (data) {
        this.life -= data.damage;
    };
    cControlPlayer.prototype.updatePlayer = function (cursors, layer, socket) {
        this.playerSprite.body.velocity.x = 0;
        this.playerSprite.body.velocity.y = 0;
        var seMueveX = false;
        var seMueveY = false;
        //me fijo si tengo que mover el jugador
        if (cursors.up.isDown) {
            this.playerSprite.body.velocity.y = -this.speedplayer;
            seMueveY = true;
            this.lastMoveY = -1;
        }
        else if (cursors.down.isDown) {
            this.playerSprite.body.velocity.y = this.speedplayer;
            seMueveY = true;
            this.lastMoveY = 1;
        }
        else if (cursors.left.isDown) {
            this.playerSprite.body.velocity.x = -this.speedplayer;
            seMueveX = true;
            this.lastMoveX = -1;
        }
        else if (cursors.right.isDown) {
            this.playerSprite.body.velocity.x = this.speedplayer;
            seMueveX = true;
            this.lastMoveX = 1;
        }
        //si dejo de moverse, me fijo hasta donde llego y lo acomodo en la grilla
        if (seMueveX == false) {
            if (this.lastMoveX != 0) {
                if (this.playerSprite.body.x % this.gridSize != 0) {
                    var velocidad1 = this.speedplayer / 60;
                    var velocidad2 = Math.abs(layer.getTileX(this.playerSprite.body.x + this.gridSize / 2) * this.gridSize - this.playerSprite.body.x);
                    this.playerSprite.body.x += this.lastMoveX * Math.min(velocidad1, velocidad2);
                }
                else {
                    this.lastMoveX = 0;
                }
            }
        }
        if (seMueveY == false) {
            if (this.lastMoveY != 0) {
                if (this.playerSprite.body.y % this.gridSize != 0) {
                    var velocidad1 = this.speedplayer / 60;
                    var velocidad2 = Math.abs(layer.getTileY(this.playerSprite.body.y + this.gridSize / 2) * this.gridSize - this.playerSprite.body.y);
                    this.playerSprite.body.y += this.lastMoveY * Math.min(velocidad1, velocidad2);
                }
                else {
                    this.lastMoveY = 0;
                }
            }
        }
        //Me fijo si cambio la posicion y si es asi emito la nueva posicion
        this.tileX = layer.getTileX(this.playerSprite.x);
        this.tileY = layer.getTileY(this.playerSprite.y);
        if (this.tileX != this.lastSendTileX || this.tileY != this.lastSendTileY) {
            this.lastSendTileX = this.tileX;
            this.lastSendTileY = this.tileY;
            socket.emit('move player', { x: this.tileX, y: this.tileY });
        }
    };
    return cControlPlayer;
}(cPlayerData));
