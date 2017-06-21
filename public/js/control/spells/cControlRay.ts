class cControlRay extends Phaser.Sprite {

    private graphics:Phaser.Graphics;
    private lastX: number;
    private lastY: number;
    private fixX: number;
    private fixY: number;
    private numberOfLines:number;
    private rayNumber:number = 0;
    private randomFactor = 3;
    private timer: Phaser.TimerEvent;
    private loopsInUpdate:number = 6;

    constructor(public controlGame: cControlGame, spriteFrom:Phaser.Sprite, spriteTo:Phaser.Sprite, color:number ) {

        super(controlGame.game,spriteFrom.x, spriteFrom.y);

        var from:Phaser.Point;
        var to:Phaser.Point;

        from = new Phaser.Point(spriteFrom.x, spriteFrom.y - 40);
        to = new Phaser.Point(spriteTo.x, spriteTo.y - 40);

        this.graphics = this.controlGame.game.add.graphics(0, 0);
        this.graphics.lineStyle(2, color, 1);

        this.graphics.moveTo(from.x , from.y);

        var maxLenght:number = 5;

        var distance = from.distance(to);

        this.numberOfLines = Math.floor(distance/maxLenght);

        this.lastX = from.x;
        this.lastY = from.y;
        this.fixX = (to.x - from.x) / this.numberOfLines ;
        this.fixY = (to.y - from.y) / this.numberOfLines;

        this.controlGame.game.add.existing(this);

    }

    public update() {

        for (var i=1; i<= this.loopsInUpdate; i++) {

            if (this.rayNumber != this.numberOfLines) {
                var randX = this.controlGame.game.rnd.integerInRange(-this.randomFactor, this.randomFactor);
                var randY = this.controlGame.game.rnd.integerInRange(-this.randomFactor,this.randomFactor);

                this.lastX += this.fixX + randX;
                this.lastY += this.fixY + randY; 

                this.graphics.lineTo(this.lastX, this.lastY);
                
                this.rayNumber ++;
                
            } else {
                var buletAnimation = this.controlGame.game.add.tween(this.graphics).to( { alpha: 0}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
                buletAnimation.onComplete.add(this.destroyBulet,this,null,this.graphics);
                return;
            }
        
        }

    }

    private makeRay() {
    }



    private destroyBulet(bulet:Phaser.Graphics, tween:Phaser.Tween) {
        bulet.destroy();
        this.destroy();
    }




}