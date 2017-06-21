var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cControlRay = (function (_super) {
    __extends(cControlRay, _super);
    function cControlRay(controlGame, spriteFrom, spriteTo, color) {
        _super.call(this, controlGame.game, spriteFrom.x, spriteFrom.y);
        this.controlGame = controlGame;
        this.rayNumber = 0;
        this.randomFactor = 3;
        this.loopsInUpdate = 6;
        var from;
        var to;
        from = new Phaser.Point(spriteFrom.x, spriteFrom.y - 40);
        to = new Phaser.Point(spriteTo.x, spriteTo.y - 40);
        this.graphics = this.controlGame.game.add.graphics(0, 0);
        this.graphics.lineStyle(2, color, 1);
        this.graphics.moveTo(from.x, from.y);
        var maxLenght = 5;
        var distance = from.distance(to);
        this.numberOfLines = Math.floor(distance / maxLenght);
        this.lastX = from.x;
        this.lastY = from.y;
        this.fixX = (to.x - from.x) / this.numberOfLines;
        this.fixY = (to.y - from.y) / this.numberOfLines;
        this.controlGame.game.add.existing(this);
    }
    cControlRay.prototype.update = function () {
        for (var i = 1; i <= this.loopsInUpdate; i++) {
            if (this.rayNumber != this.numberOfLines) {
                var randX = this.controlGame.game.rnd.integerInRange(-this.randomFactor, this.randomFactor);
                var randY = this.controlGame.game.rnd.integerInRange(-this.randomFactor, this.randomFactor);
                this.lastX += this.fixX + randX;
                this.lastY += this.fixY + randY;
                this.graphics.lineTo(this.lastX, this.lastY);
                this.rayNumber++;
            }
            else {
                var buletAnimation = this.controlGame.game.add.tween(this.graphics).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
                buletAnimation.onComplete.add(this.destroyBulet, this, null, this.graphics);
                return;
            }
        }
    };
    cControlRay.prototype.makeRay = function () {
    };
    cControlRay.prototype.destroyBulet = function (bulet, tween) {
        bulet.destroy();
        this.destroy();
    };
    return cControlRay;
}(Phaser.Sprite));
