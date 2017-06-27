var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cControlMissile = (function (_super) {
    __extends(cControlMissile, _super);
    function cControlMissile(controlGame, spriteFrom, spriteTo) {
        _super.call(this, controlGame.game, spriteFrom.x, spriteFrom.y, 'rocket');
        this.controlGame = controlGame;
        this.spriteTo = spriteTo;
        this.SPEED = 250; // missile speed pixels/second
        this.TURN_RATE = 5; // turn rate in degrees/frame
        this.yOffset = -40;
        this.WOBBLE_LIMIT = 8; //degress
        this.WOBBLE_SPEED = 250; //miliseconds
        this.controlGame.game.physics.arcade.enable(this);
        //to inform when the animation finish
        this.finish = new Phaser.Signal();
        //lets check the orientation of the character to trow this spell 
        if (this.controlGame.controlPlayer.lastAnimation == move.idleLeft) {
            this.rotation = Math.PI;
        }
        // Create a variable called wobble that tweens back and forth between
        // -this.WOBBLE_LIMIT and +this.WOBBLE_LIMIT forever
        this.wobble = this.WOBBLE_LIMIT;
        this.game.add.tween(this)
            .to({ wobble: -this.WOBBLE_LIMIT }, this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.POSITIVE_INFINITY, true);
        //to use the update loop 
        this.controlGame.game.add.existing(this);
    }
    cControlMissile.prototype.update = function () {
        var targetAngle = Phaser.Math.angleBetween(this.x, this.y, this.spriteTo.x, this.spriteTo.y + this.yOffset);
        // Add our "wobble" factor to the targetAngle to make the missile wobble
        // Remember that this.wobble is tweening (above)
        targetAngle += Phaser.Math.degToRad(this.wobble);
        // Gradually (this.TURN_RATE) aim the missile towards the target angle
        if (this.rotation !== targetAngle) {
            // Calculate difference between the current angle and targetAngle
            var delta = targetAngle - this.rotation;
            // Keep it in range from -180 to 180 to make the most efficient turns.
            if (delta > Math.PI)
                delta -= Math.PI * 2;
            if (delta < -Math.PI)
                delta += Math.PI * 2;
            if (delta > 0) {
                // Turn clockwise
                this.angle += this.TURN_RATE;
            }
            else {
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
    };
    return cControlMissile;
}(Phaser.Sprite));
