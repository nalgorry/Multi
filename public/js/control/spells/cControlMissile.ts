class cControlMissile extends Phaser.Sprite {

     private SPEED = 250; // missile speed pixels/second
     private TURN_RATE = 5; // turn rate in degrees/frame
     private yOffset = -40;

     public finish: Phaser.Signal;
 
    constructor(public controlGame: cControlGame, 
        spriteFrom:Phaser.Sprite, 
        public spriteTo:Phaser.Sprite ) {
            super(controlGame.game, spriteFrom.x, spriteFrom.y, 'rocket');

             this.controlGame.game.physics.arcade.enable(this);

             this.finish = new Phaser.Signal();

            //to use the update loop 
            this.controlGame.game.add.existing(this);

        }

        public update() {
        
        var targetAngle = Phaser.Math.angleBetween(
                this.x, this.y,
                this.spriteTo.x, this.spriteTo.y + this.yOffset
            );

            // Gradually (this.TURN_RATE) aim the missile towards the target angle
            if (this.rotation !== targetAngle) {
                // Calculate difference between the current angle and targetAngle
                var delta = targetAngle - this.rotation;

                // Keep it in range from -180 to 180 to make the most efficient turns.
                if (delta > Math.PI) delta -= Math.PI * 2;
                if (delta < -Math.PI) delta += Math.PI * 2;

                if (delta > 0) {
                    // Turn clockwise
                    this.angle += this.TURN_RATE;
                } else {
                    // Turn counter-clockwise
                    this.angle -= this.TURN_RATE;
                }

                // Just set angle to target angle if they are close
                if (Math.abs(delta) < Phaser.Math.degToRad(this.TURN_RATE)) {
                    this.rotation = targetAngle;
                }
            }

            // Calculate velocity vector based on this.rotation and this.SPEED
            this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
            this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;

            //lets chech distance
            var distance = Phaser.Math.distance(this.x, this.y, this.spriteTo.x, this.spriteTo.y);

            if (distance < 50) {
                this.destroy();
                this.finish.dispatch();
            }
            
        }



}