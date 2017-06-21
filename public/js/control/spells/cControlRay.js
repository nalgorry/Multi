var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cControlRay = (function (_super) {
    __extends(cControlRay, _super);
    function cControlRay(controlGame, spriteFrom, spriteTo, color, spellDamage, hitTextPosition, spell) {
        _super.call(this, controlGame.game, 0, 0);
        this.controlGame = controlGame;
        this.spriteTo = spriteTo;
        this.spellDamage = spellDamage;
        this.hitTextPosition = hitTextPosition;
        this.spell = spell;
        this.randomFactor = 3;
        this.randomCorrectionFactor = 2;
        this.maxLenght = 5;
        this.numberOfUpdates = 6;
        this.rayNumber = 0;
        this.rayActive = true;
        this.acumX = 0;
        this.acumY = 0;
        if (spriteFrom != null) {
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
            this.controlGame.game.add.existing(this);
        }
        else {
            //if not ray in needed, we show only the text 
            this.showDamageText();
            this.spellAnimation(this.spriteTo);
        }
    }
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
                //lets add a damage text 
                this.showDamageText();
                //lets make the animation
                this.spellAnimation(this.spriteTo);
                //lets kill the loops
                this.rayActive = false;
                return;
            }
        }
    };
    cControlRay.prototype.spellAnimation = function (sprite) {
        //animiacion de la bomba 
        if (this.spell.explotionFollowCharacter == true) {
            var boomSprite = this.controlGame.game.add.sprite(0, this.spell.explotionYOffset, this.spell.explotionSprite);
            sprite.addChild(boomSprite);
        }
        else {
            var boomSprite = this.controlGame.game.add.sprite(sprite.x, sprite.y + this.spell.explotionYOffset, this.spell.explotionSprite);
        }
        boomSprite.anchor.set(0.5, 1);
        var animation = boomSprite.animations.add('boom');
        //cambio el tint de la explosión si viene con 
        if (this.tint != null) {
            boomSprite.tint = this.tint;
        }
        sprite.addChild(boomSprite);
        if (this.spell.explotionTimeSeconds == 0) {
            boomSprite.animations.play('boom', this.spell.explotionFrameRate, false, true);
        }
        else {
            boomSprite.animations.play('boom', this.spell.explotionFrameRate, true, true);
            this.controlGame.game.time.events.add(Phaser.Timer.SECOND * this.spell.explotionTimeSeconds, this.spell.animationFinish, animation);
        }
    };
    cControlRay.prototype.showDamageText = function () {
        //texto con el daño
        if (this.spellDamage != 0) {
            if (this.spellDamage > 0) {
                var styleHit = { font: "18px Arial", fill: "#750303", fontWeight: 900 };
            }
            else {
                var styleHit = { font: "18px Arial", fill: "#113d01", fontWeight: 900 };
                this.spellDamage = -this.spellDamage;
            }
            ;
            var completeText = this.controlGame.game.add.sprite(this.hitTextPosition, -40);
            //texto que se muestra
            var hitText = this.controlGame.game.add.text(0, 0, this.spellDamage.toString(), styleHit);
            //hago un recuadro blanco abajo del texto
            var rectangleBack = this.controlGame.game.add.bitmapData(hitText.width, 20);
            rectangleBack.ctx.beginPath();
            rectangleBack.ctx.rect(0, 0, hitText.width, 20);
            rectangleBack.ctx.fillStyle = '#ffffff';
            rectangleBack.ctx.fill();
            var textBack = this.controlGame.game.add.sprite(0, 0, rectangleBack);
            textBack.alpha = 0.6;
            completeText.addChild(textBack);
            completeText.addChild(hitText);
            this.spriteTo.addChild(completeText);
            var tweenText = this.controlGame.game.add.tween(completeText).to({ y: '-40' }, 1000, Phaser.Easing.Cubic.Out, true);
            tweenText.onComplete.add(this.removeTweenText, completeText);
        }
    };
    cControlRay.prototype.removeTweenText = function (sprite) {
        sprite.destroy();
    };
    cControlRay.prototype.destroyBulet = function (bulet, tween) {
        bulet.destroy();
        this.destroy();
    };
    return cControlRay;
}(Phaser.Sprite));
