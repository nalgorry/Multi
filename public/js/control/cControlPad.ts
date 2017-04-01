class cControlPad extends Phaser.Sprite{

    private centerSprite:Phaser.Graphics;
    private dragger:Phaser.Sprite;
    private direction: Phaser.Point;
    private pinAngle:number
    private distance: number;
    private disabled: boolean;
    private isBeingDragged:boolean;
    private zero:Phaser.Point = new Phaser.Point(0, 0);
    private normalize = Phaser.Point.normalize;

    public onDown:Phaser.Signal;
    public onUp:Phaser.Signal;
    public onMove:Phaser.Signal;
 
    constructor(public controlGame: cControlGame, x:number, y:number) {
		super(controlGame.game, 0 , 0, null);

        this.fixedToCamera = true;
        this.cameraOffset.x = x;
        this.cameraOffset.y = y;
        this.anchor.set(0.5,0.5);
      

        var game = this.controlGame.game;

		this.direction      = new Phaser.Point(0, 0);
		this.distance       = 0;
		this.pinAngle       = 0;
		this.disabled       = false;
		this.isBeingDragged = false;

		this.onDown = new Phaser.Signal();
		this.onUp   = new Phaser.Signal();
		this.onMove = new Phaser.Signal();

        //creo el circulo de abajo del pad
        var bigCircle = this.controlGame.game.add.graphics(0,0);
        bigCircle.lineStyle(2, 0x141417, 1);
        bigCircle.beginFill(0x141417);
        bigCircle.drawCircle(0, 0, 90);
        bigCircle.alpha = 0.5;
        bigCircle.pivot.set(0.5,0.5);
        this.addChild(bigCircle);
		
        //creo el circulo del pad
        this.centerSprite = this.controlGame.game.add.graphics(0,0);
        this.centerSprite.lineStyle(2, 0x141417, 1);
        this.centerSprite.beginFill(0x141417);
        this.centerSprite.drawCircle(0, 0, 40);
		this.centerSprite.pivot.set(0.5,0.5);
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

    onDragStart(){
        //console.log("entra")
		this.isBeingDragged = true;
		if (this.disabled) return;
		this.onDown.dispatch();
	}
	onDragStop(){
		this.isBeingDragged = false;
		/* Reset pin and dragger position */
		this.centerSprite.position.setTo(0, 0);
        this.dragger.cameraOffset.copyFrom(this.cameraOffset);
		if (this.disabled) return;
		this.onUp.dispatch(this.direction, this.distance, this.pinAngle);
	}

    update(){
		if (this.isBeingDragged) {
			var pin       = this.centerSprite.position;
            this.zero = this.position;
			this.pinAngle = this.zero.angle(this.dragger.position);
			this.distance = this.dragger.position.getMagnitude();
			var direction = this.normalize(this.dragger.position, this.direction);
			pin.copyFrom(this.dragger.position.subtract(this.zero.x,this.zero.y));
			pin.setMagnitude(40);
			if (this.disabled) return;
            
            //saco la dirección de mov segun el angulo 
            var degreeAngle = this.pinAngle * 180 / Math.PI;
            var moveDir:dirPad;

            if (degreeAngle > -22.5 && degreeAngle < 22.5 ) {
                moveDir = dirPad.right;
                //console.log("derecha");
            } else if (degreeAngle > 22.5 && degreeAngle < 67.5  )  {
                moveDir = dirPad.downRight;
                //console.log("abajo y derecha");
            } else if (degreeAngle > 67.5  && degreeAngle < 112.5 )  {
                moveDir = dirPad.down;
                //console.log("abajo");
            } else if (degreeAngle > 112.5  && degreeAngle < 157.5 )  {
                moveDir = dirPad.downLeft;
                //console.log("abajo izquieda");
            } else if (Math.abs(degreeAngle) > 157.5) {
                moveDir = dirPad.left;
                //console.log("izquierda");
            } else if (degreeAngle < -22.5 && degreeAngle > -67.5  )  {
                moveDir = dirPad.upRight;
                //console.log("arriba y derecha");
            } else if (degreeAngle < -67.5  && degreeAngle > -112.5 )  {
                moveDir = dirPad.up;
                //console.log("arriba");
            } else if (degreeAngle < -112.5  && degreeAngle > -157.5 )  {
                moveDir = dirPad.upLeft;
                ////console.log("arriba izquieda");
            }

            this.onMove.dispatch(moveDir);


		}
	}

}

enum dirPad {
        right,
        downRight,
        down,
        downLeft,
        left,
        upLeft,
        up,
        upRight,
}