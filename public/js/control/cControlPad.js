var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cControlPad = (function (_super) {
    __extends(cControlPad, _super);
    function cControlPad(controlGame, x, y) {
        _super.call(this, controlGame.game, 0, 0, null);
        this.controlGame = controlGame;
        this.zero = new Phaser.Point(0, 0);
        this.normalize = Phaser.Point.normalize;
        this.fixedToCamera = true;
        this.cameraOffset.x = x;
        this.cameraOffset.y = y;
        this.anchor.set(0.5, 0.5);
        var game = this.controlGame.game;
        this.direction = new Phaser.Point(0, 0);
        this.distance = 0;
        this.pinAngle = 0;
        this.disabled = false;
        this.isBeingDragged = false;
        this.onDown = new Phaser.Signal();
        this.onUp = new Phaser.Signal();
        this.onMove = new Phaser.Signal();
        //creo el circulo de abajo del pad
        var bigCircle = this.controlGame.game.add.graphics(0, 0);
        bigCircle.lineStyle(2, 0x141417, 1);
        bigCircle.beginFill(0x141417);
        bigCircle.drawCircle(0, 0, 90);
        bigCircle.alpha = 0.5;
        bigCircle.pivot.set(0.5, 0.5);
        this.addChild(bigCircle);
        //creo el circulo del pad
        this.centerSprite = this.controlGame.game.add.graphics(0, 0);
        this.centerSprite.lineStyle(2, 0x141417, 1);
        this.centerSprite.beginFill(0x141417);
        this.centerSprite.drawCircle(0, 0, 40);
        this.centerSprite.pivot.set(0.5, 0.5);
        //this.centerSprite.fixedToCamera = true;
        //this.centerSprite.cameraOffset.x = x;
        //this.centerSprite.cameraOffset.y = y;
        this.addChild(this.centerSprite);
        /* Invisible sprite that players actually drag */
        var dragger = this.dragger = game.add.sprite(0, 0, null);
        dragger.anchor.setTo(0.5, 0.5);
        dragger.width = dragger.height = 181;
        dragger.inputEnabled = true;
        dragger.input.enableDrag(true);
        /* Set flags on drag */
        dragger.events.onDragStart.add(this.onDragStart, this);
        dragger.events.onDragStop.add(this.onDragStop, this);
        dragger.fixedToCamera = true;
        dragger.cameraOffset.x = x;
        dragger.cameraOffset.y = y;
        //this.addChild(dragger);
        game.add.existing(this);
    }
    cControlPad.prototype.onDragStart = function () {
        //console.log("entra")
        this.isBeingDragged = true;
        if (this.disabled)
            return;
        this.onDown.dispatch();
    };
    cControlPad.prototype.onDragStop = function () {
        this.isBeingDragged = false;
        /* Reset pin and dragger position */
        this.centerSprite.position.setTo(0, 0);
        console.log(this.dragger.position);
        this.dragger.cameraOffset.copyFrom(this.cameraOffset);
        console.log(this.dragger.position);
        if (this.disabled)
            return;
        this.onUp.dispatch(this.direction, this.distance, this.pinAngle);
    };
    cControlPad.prototype.update = function () {
        if (this.isBeingDragged) {
            var pin = this.centerSprite.position;
            this.zero = this.position;
            this.pinAngle = this.zero.angle(this.dragger.position);
            this.distance = this.dragger.position.getMagnitude();
            var direction = this.normalize(this.dragger.position, this.direction);
            pin.copyFrom(this.dragger.position.subtract(this.zero.x, this.zero.y));
            pin.setMagnitude(40);
            if (this.disabled)
                return;
            //saco la dirección de mov segun el angulo 
            var degreeAngle = this.pinAngle * 180 / Math.PI;
            var moveDir;
            if (degreeAngle > -22.5 && degreeAngle < 22.5) {
                moveDir = dirPad.right;
            }
            else if (degreeAngle > 22.5 && degreeAngle < 67.5) {
                moveDir = dirPad.downRight;
            }
            else if (degreeAngle > 67.5 && degreeAngle < 112.5) {
                moveDir = dirPad.down;
            }
            else if (degreeAngle > 112.5 && degreeAngle < 157.5) {
                moveDir = dirPad.downLeft;
            }
            else if (Math.abs(degreeAngle) > 157.5) {
                moveDir = dirPad.left;
            }
            else if (degreeAngle < -22.5 && degreeAngle > -67.5) {
                moveDir = dirPad.upRight;
            }
            else if (degreeAngle < -67.5 && degreeAngle > -112.5) {
                moveDir = dirPad.up;
            }
            else if (degreeAngle < -112.5 && degreeAngle > -157.5) {
                moveDir = dirPad.upLeft;
            }
            this.onMove.dispatch(moveDir);
        }
    };
    return cControlPad;
}(Phaser.Sprite));
var dirPad;
(function (dirPad) {
    dirPad[dirPad["right"] = 0] = "right";
    dirPad[dirPad["downRight"] = 1] = "downRight";
    dirPad[dirPad["down"] = 2] = "down";
    dirPad[dirPad["downLeft"] = 3] = "downLeft";
    dirPad[dirPad["left"] = 4] = "left";
    dirPad[dirPad["upLeft"] = 5] = "upLeft";
    dirPad[dirPad["up"] = 6] = "up";
    dirPad[dirPad["upRight"] = 7] = "upRight";
})(dirPad || (dirPad = {}));
