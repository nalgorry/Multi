class cControlArrow {

    public finish:Phaser.Signal

    constructor(public controlGame:cControlGame, spriteFrom:Phaser.Sprite, spriteTo:Phaser.Sprite ) {
        
        this.finish = new Phaser.Signal();
        
        this.makeArrow(spriteFrom, spriteTo);
    }

  private makeArrow(spriteFrom:Phaser.Sprite, spriteTo:Phaser.Sprite) {

        var xOffset:number = 0;
        var yOffset:number = -40;

        var arrow = this.controlGame.game.add.sprite(0,0,'arrow')
        spriteTo.addChild(arrow);

        arrow.position.setTo(spriteFrom.x - spriteTo.x + xOffset , spriteFrom.y - spriteTo.y+ + yOffset);
        arrow.anchor.set(0.5);

        var angle = (360 / (2 * Math.PI)) * Phaser.Math.angleBetween(spriteFrom.x, spriteFrom.y, spriteTo.x, spriteTo.y) + 90;

        arrow.angle = angle;

        var animation = this.controlGame.game.add.tween(arrow).to( { 
            x: xOffset, y: yOffset}, 300, Phaser.Easing.Linear.None, true);
        
        animation.onComplete.add(this.arrowComplete,this,null, arrow);
    }

    private arrowComplete(arrow: Phaser.Sprite){
        //lets make the ray disapear slowly
        var desapearArrow = this.controlGame.game.add.tween(arrow).to( { alpha: 0}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
        desapearArrow.onComplete.add(this.destroyArrow,this,null,arrow);

        this.finish.dispatch();

        return;
    }

    private destroyArrow(arrow:Phaser.Sprite) {
        arrow.destroy();
    }

}