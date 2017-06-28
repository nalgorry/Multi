class cControlSpellAnim {

    constructor(public controlGame: cControlGame, 
            spriteFrom:Phaser.Sprite, 
            public spriteTo:Phaser.Sprite, 
            color:number, 
            public spellDamage: number,
            public hitTextPosition,
            public spell: cSpell) {

                //lets check if we have to do a ray 
                if (spriteFrom != null) {

                    //lets see wich ray we have to do 
                    switch (spell.rayAnimationType) {
                        case enumRayAnimations.arrow:
                            var ray3 = new cControlArrow(controlGame,spriteFrom,spriteTo);
                            ray3.finish.add(this.rayFinish,this);
                            break;
                        case enumRayAnimations.missile:
                            var ray = new cControlMissile(controlGame,spriteFrom,spriteTo)
                            ray.finish.add(this.rayFinish,this);
                            break;
                        case enumRayAnimations.ray:
                            var ray2 = new cControlRay(controlGame,spriteFrom,spriteTo, color);
                            ray2.finish.add(this.rayFinish,this);
                            break;
                    
                        default:
                            break;
                    }

                }
                else  {
                    this.rayFinish();
                }


                
    }

    public rayFinish() {
        this.spellAnimation();
        this.showDamageText();
    }

     public spellAnimation() {
        //animiacion de la bomba 
        if (this.spell.explotionFollowCharacter == true) {
            var boomSprite = this.controlGame.game.add.sprite(0 , this.spell.explotionYOffset,
                this.spell.explotionSprite);
            this.spriteTo.addChild(boomSprite);
        } else {
            var boomSprite = this.controlGame.game.add.sprite(this.spriteTo.x , this.spriteTo.y + this.spell.explotionYOffset,
                this.spell.explotionSprite);
        }    

        boomSprite.anchor.set(0.5,1);
        
        var animation = boomSprite.animations.add('boom');

        //cambio el tint de la explosión si viene con 
        if (this.spell.tint != null) {boomSprite.tint = this.spell.tint;}

        this.spriteTo.addChild(boomSprite);
        
        if (this.spell.explotionTimeSeconds == 0) {
            boomSprite.animations.play('boom',this.spell.explotionFrameRate,false,true);
        } else {
            boomSprite.animations.play('boom',this.spell.explotionFrameRate,true,true);
            this.controlGame.game.time.events.add(Phaser.Timer.SECOND * this.spell.explotionTimeSeconds, this.spell.animationFinish, animation);
        }   

    }

    private showDamageText() {
        //texto con el daño
        if (this.spellDamage != 0) {

            if (this.spellDamage > 0) { //daño real 
                var styleHit = { font: "18px Arial", fill: "#750303", fontWeight: 900 }
            } else { //curacción
                var styleHit = { font: "18px Arial", fill: "#113d01", fontWeight: 900 }
                this.spellDamage = -this.spellDamage;
            };

            var completeText = this.controlGame.game.add.sprite(this.hitTextPosition , -40);
            
            //texto que se muestra
            var hitText = this.controlGame.game.add.text(0,0, this.spellDamage.toString(), styleHit);            

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

            var tweenText = this.controlGame.game.add.tween(completeText).to({y: '-40'}, 1000, Phaser.Easing.Cubic.Out, true);
            tweenText.onComplete.add(this.removeTweenText,completeText);
        }

    }

    removeTweenText(sprite:Phaser.Sprite) {        
        sprite.destroy();        
    }




}