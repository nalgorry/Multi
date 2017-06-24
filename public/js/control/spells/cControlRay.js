var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cControlRay = (function (_super) {
    __extends(cControlRay, _super);
    function cControlRay(controlGame, spriteFrom, spriteTo, color) {
        _super.call(this, controlGame.game, 0, 0);
        this.controlGame = controlGame;
        this.spriteTo = spriteTo;
        this.randomFactor = 3;
        this.randomCorrectionFactor = 2;
        this.maxLenght = 5;
        this.numberOfUpdates = 6;
        this.rayNumber = 0;
        this.rayActive = true;
        this.acumX = 0;
        this.acumY = 0;
        this.finish = new Phaser.Signal();
        this.makeRay(spriteFrom, spriteTo, color);
    }
    cControlRay.prototype.makeRay = function (spriteFrom, spriteTo, color) {
        var from;
        var to;
        from = new Phaser.Point(spriteFrom.x, spriteFrom.y - 40);
        to = new Phaser.Point(spriteTo.x, spriteTo.y - 40);
        this.graphics = this.controlGame.game.add.graphics(0, 0);
        this.graphics.lineStyle(2, color, 1);
        this.graphics.moveTo(from.x, from.y);
        var distance = from.distance(to);
        this.numberOfLines = Math.floor(distance / this.maxLenght);
        this.loopsInUpdate = Math.floor(this.numberOfLines / this.numberOfUpdates);
        this.lastX = from.x;
        this.lastY = from.y;
        this.fixX = (to.x - from.x) / this.numberOfLines;
        this.fixY = (to.y - from.y) / this.numberOfLines;
        //we contruct the ray in the update loop
        this.controlGame.game.add.existing(this);
    };
    cControlRay.prototype.update = function () {
        if (this.rayActive == false) {
            return;
        }
        for (var i = 1; i <= this.loopsInUpdate; i++) {
            if (this.rayNumber != this.numberOfLines) {
                var randomFactorXMin = this.randomFactor;
                var randomFactorXMax = this.randomFactor;
                var randomFactorYMin = this.randomFactor;
                var randomFactorYMax = this.randomFactor;
                //we try to avoid the x and y to go too far away
                if (this.acumX > this.randomCorrectionFactor) {
                    randomFactorXMin += Math.floor(this.acumX / this.randomCorrectionFactor);
                }
                else if (this.acumX < -this.randomCorrectionFactor) {
                    randomFactorXMax += Math.floor(-this.acumX / this.randomCorrectionFactor);
                }
                if (this.acumY > this.randomCorrectionFactor) {
                    randomFactorYMin += Math.floor(this.acumY / this.randomCorrectionFactor);
                }
                else if (this.acumY < -this.randomCorrectionFactor) {
                    randomFactorYMax += Math.floor(-this.acumY / this.randomCorrectionFactor);
                }
                var randX = this.controlGame.game.rnd.integerInRange(-randomFactorXMin, randomFactorXMax);
                var randY = this.controlGame.game.rnd.integerInRange(-randomFactorYMin, randomFactorYMax);
                this.lastX += this.fixX + randX;
                this.lastY += this.fixY + randY;
                this.acumX += randX;
                this.acumY += randY;
                this.graphics.lineTo(this.lastX, this.lastY);
                this.rayNumber++;
            }
            else {
                //lets make the ray disapear slowly
                var buletAnimation = this.controlGame.game.add.tween(this.graphics).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
                buletAnimation.onComplete.add(this.destroyBulet, this, null, this.graphics);
                //lets kill the loops
                this.rayActive = false;
                //lets inform the hit is done 
                this.finish.dispatch();
                return;
            }
        }
    };
    cControlRay.prototype.destroyBulet = function (bulet, tween) {
        bulet.destroy();
        this.destroy();
    };
    return cControlRay;
}(Phaser.Sprite));
