class cControlRay extends Phaser.Sprite {

    private randomFactor = 3;
    private randomCorrectionFactor = 2;
    private maxLenght:number = 5;
    private numberOfUpdates = 6;
    private numberOfVisibleParts = 25;

    private graphics:Phaser.Graphics[] = [];
    private groupGraphics: Phaser.Group;
    private lastX: number;
    private lastY: number;
    private fixX: number;
    private fixY: number;
    private numberOfLines:number;
    private rayNumber:number = 0;
    private rayActive:boolean = true;
    private rayPartNumber:number = 0; //to control the part of the ray we are drawing

    private acumX:number = 0;
    private acumY:number = 0;
    
    private loopsInUpdate:number;

    public finish: Phaser.Signal

    constructor(public controlGame: cControlGame, 
        spriteFrom:Phaser.Sprite, 
        public spriteTo:Phaser.Sprite, color) {

        super(controlGame.game,0, 0);

        this.finish = new Phaser.Signal();

        this.groupGraphics = new Phaser.Group(this.controlGame.game);

        this.makeRay(spriteFrom, spriteTo, color);

    }
    

    private makeRay(spriteFrom:Phaser.Sprite, spriteTo:Phaser.Sprite, color) {
        var from:Phaser.Point;
            var to:Phaser.Point;

            from = new Phaser.Point(spriteFrom.x, spriteFrom.y - 40);
            to = new Phaser.Point(spriteTo.x, spriteTo.y - 40);

            var distance = from.distance(to);

            this.numberOfLines = Math.floor(distance/this.maxLenght);
            this.loopsInUpdate = Math.floor(this.numberOfLines/this.numberOfUpdates)

            //lets create all the graphics where the lines will be draw
            for (var i = 0; i< this.numberOfLines; i++) {
                this.graphics[i] = this.controlGame.game.add.graphics(0, 0);
                this.graphics[i].lineStyle(2, color, 1);
                this.groupGraphics.add(this.graphics[i]);
            }

            this.graphics[0].moveTo(from.x , from.y);

            this.lastX = from.x;
            this.lastY = from.y;
            this.fixX = (to.x - from.x) / this.numberOfLines ;
            this.fixY = (to.y - from.y) / this.numberOfLines;

            //we contruct the ray in the update loop
            this.controlGame.game.add.existing(this);
    }

    public update() {

        if (this.rayActive == false) {return;}

        for (var i=1; i<= this.loopsInUpdate; i++) {

            if (this.rayNumber != this.numberOfLines) {

                var randomFactorXMin:number = this.randomFactor;
                var randomFactorXMax:number = this.randomFactor;
                var randomFactorYMin:number = this.randomFactor;
                var randomFactorYMax:number = this.randomFactor;

                //we try to avoid the x and y to go too far away
                if (this.acumX > this.randomCorrectionFactor) {
                    randomFactorXMin += Math.floor(this.acumX / this.randomCorrectionFactor);
                } else if (this.acumX < -this.randomCorrectionFactor) {
                    randomFactorXMax += Math.floor(-this.acumX / this.randomCorrectionFactor);
                }

                if (this.acumY > this.randomCorrectionFactor) {
                    randomFactorYMin += Math.floor(this.acumY / this.randomCorrectionFactor);
                } else if (this.acumY < -this.randomCorrectionFactor) {
                    randomFactorYMax += Math.floor(-this.acumY / this.randomCorrectionFactor);
                }

                var randX = this.controlGame.game.rnd.integerInRange(-randomFactorXMin, randomFactorXMax);
                var randY = this.controlGame.game.rnd.integerInRange(-randomFactorYMin, randomFactorYMax);

                this.lastX += this.fixX + randX;
                this.lastY += this.fixY + randY; 

                this.acumX += randX;
                this.acumY += randY;

                this.graphics[this.rayPartNumber].lineTo(this.lastX, this.lastY);
                
                this.rayNumber ++;
                
            } else {
                
                //lets make the ray disapear slowly
                var buletAnimation = this.controlGame.game.add.tween(this.groupGraphics).to( { alpha: 0}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
                buletAnimation.onComplete.add(this.destroyBulet,this,null,this.graphics);

                //lets kill the loops
                this.rayActive = false;

                //lets inform the hit is done 
                this.finish.dispatch();

                return;

            }

            //lets destroy the last part of the ray
            if (this.rayPartNumber >= this.numberOfVisibleParts) {
                this.graphics[this.rayPartNumber - this.numberOfVisibleParts].destroy();
            }

            //lets prepare the next part of the ray
            if (this.rayPartNumber + 1 != this.numberOfLines) {
                this.graphics[this.rayPartNumber + 1].moveTo(this.lastX, this.lastY)
                this.rayPartNumber ++;
            }

        
        }

    }


    private destroyBulet(bulet:Phaser.Graphics, tween:Phaser.Tween) {
        this.groupGraphics.destroy();
        this.destroy();
    }




}