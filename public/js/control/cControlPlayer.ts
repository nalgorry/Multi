enum move {
    up = Phaser.Keyboard.W,
    down = Phaser.Keyboard.S,
    left = Phaser.Keyboard.A,
    right = Phaser.Keyboard.D,
    idle = 0
    }

class cControlPlayer extends cBasicActor {
    

    public idServer: string;
    
    public lastSendTileX: number;
    public lastSendTileY: number;

    public controlFocus: cControlFocus;
    public controlSpells:cControlSpells;

    private speedplayer: number = 150;
    
    private lastMoveX: number = 0;
    private lastMoveY: number = 0;
    private seMueveX:Boolean = false;
    private seMueveY:Boolean = false;

    private dirMovimiento:move;
    private lastdirMov:move; //para guardar el ultimo moviemiento enviado
    
    private gridSize: number;

    //texto para mostrar daño (temporal)
    style = { font: "15px Arial", fill: "#ff0044"};
    hitText:Phaser.Text = this.controlGame.game.add.text(0, 15,"Trata de golpear a alguien",this.style);
    
    constructor(controlGame:cControlGame) {
        super(controlGame);

        this.startActor();
        this.startPlayer();
        this.gridSize = controlGame.gridSize;

        this.hitText.fixedToCamera = true;
    }

    public startPlayer() {

        //Cargo el sistema de controlFocus
        this.controlFocus = new cControlFocus(this.controlGame);

        //Cargo el sistema de hechizos.
        this.controlSpells = new cControlSpells(this.controlGame);

        this.controlGame.game.physics.arcade.enable(this.playerSprite);
        
        this.playerSprite.body.collideWorldBounds = true;
        this.playerSprite.body.width = this.controlGame.gridSize;
        this.playerSprite.body.height =this.controlGame.gridSize;
        this.playerSprite.body.offset.y =this.playerSprite.height - this.controlGame.gridSize; 

        this.controlGame.game.camera.follow(this.playerSprite);
        this.controlGame.game.camera.deadzone = new Phaser.Rectangle(
            this.controlGame.game.width / 2 - this.controlGame.interfaz.width / 2,
            this.controlGame.game.height / 2 ,0,0);

        //controlo el movimiento del jugador
        var W = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.W);
        var A = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.A);
        var S = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.S);
        var D = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.D);
       
        W.onDown.add(this.moveKeyPress,this);
        A.onDown.add(this.moveKeyPress,this);
        S.onDown.add(this.moveKeyPress,this);
        D.onDown.add(this.moveKeyPress,this);
        
        W.onUp.add(this.moveKeyRelease,this);
        A.onUp.add(this.moveKeyRelease,this);
        S.onUp.add(this.moveKeyRelease,this);
        D.onUp.add(this.moveKeyRelease,this);

        //controles de Focus 
        var one = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        one.onDown.add(this.controlFocus.SelectLifeFocus,this.controlFocus); 
        var two = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        two.onDown.add(this.controlFocus.SelectManaFocus,this.controlFocus); 
        var three = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        three.onDown.add(this.controlFocus.SelectEnergyFocus,this.controlFocus);
        
        //controles adicionales para test
        var H = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.H);
        H.onDown.add(this.controlFocus.ResetBars,this.controlFocus);

    }

    //esto se activa cuando golepan al jugador actual
    public playerHit(data) {

        //resto la vida y controlo si murio 
        if (this.controlFocus.UpdateLife(-data.damage)) {
            this.youDie(data);
        } 
        
        this.onHit(data); //esto hace aparecer el cartelito con la vida que te queda

    }

    public youHit(data) {
        this.hitText.text = "Golpeaste a alguien por " + data.damage;
    }

    public youDie(data) {

        this.playerSprite.x = 0;
        this.playerSprite.y = 0;
        this.controlFocus.UpdateLife(this.controlFocus.maxLife);
    }

    public youKill(data) {

    }

    public playerUpdate() {

        //me fijo para que lado se esta moviendo 
        if (this.seMueveX == true && this.seMueveY == false) {
            this.playerSprite.body.velocity.x = this.speedplayer * this.lastMoveX;
            this.playerSprite.body.velocity.y = 0;
        } else if (this.seMueveX == false && this.seMueveY == true) {
            this.playerSprite.body.velocity.y = this.speedplayer * this.lastMoveY;
            this.playerSprite.body.velocity.x = 0;
        } else if (this.seMueveX == true && this.seMueveY == true) {
            this.playerSprite.body.velocity.x = this.speedplayer * this.lastMoveX * 0.7071;
            this.playerSprite.body.velocity.y = this.speedplayer * this.lastMoveY * 0.7071;
        } else if (this.seMueveX == false && this.seMueveY == false) {
            this.playerSprite.body.velocity.x = 0;
            this.playerSprite.body.velocity.y = 0;
        }

        //si solto una tecla lo acomodo en la grilla
        if (this.seMueveX == false) {
            if (this.lastMoveX != 0) {
                if (this.playerSprite.body.x%this.gridSize != 0) 
                {
                    var velocidad1:number = this.speedplayer/60;
                    var velocidad2:number = Math.abs(this.controlGame.layer.getTileX(this.playerSprite.body.x + this.gridSize/2) * this.gridSize - this.playerSprite.body.x); 

                    this.playerSprite.body.x += this.lastMoveX * Math.min(velocidad1,velocidad2);

                } else {
                    this.lastMoveX = 0;
                    this.dirMovimiento = move.idle;
                }
            }
        } 

        if (this.seMueveY == false) {
            if (this.lastMoveY != 0) {
                if (this.playerSprite.body.y%this.gridSize != 0) 
                {
                    var velocidad1:number = this.speedplayer/60;
                    var velocidad2:number = Math.abs(this.controlGame.layer.getTileY(this.playerSprite.body.y + this.gridSize/2) * this.gridSize - this.playerSprite.body.y); 

                    this.playerSprite.body.y += this.lastMoveY * Math.min(velocidad1,velocidad2);
                } else {
                    this.lastMoveY = 0;
                    this.dirMovimiento = move.idle;
                }
            }
        } 

        //control de las animaciones
        if (this.lastMoveX == 0 && this.lastMoveY == 0) {
            this.startAnimation('idle');
        }
        if (this.lastMoveX == 0 || this.lastMoveY == 0 ) { //solo animo si se mueve en x o en y, si toca las dos mantengo la ultima animación

            if (this.lastMoveX == 1) { //se esta moviendo hacia la derecha
                this.startAnimation('right');
                this.dirMovimiento = move.right;
            }
            if (this.lastMoveX == -1) { //se esta moviendo hacia la izquierda
                this.startAnimation('left');
                this.dirMovimiento = move.left;
            }
            if (this.lastMoveY == 1) { //se esta moviendo hacia arriba
                this.startAnimation('down');
                this.dirMovimiento = move.down;
            }
            if (this.lastMoveY == -1) { //se esta moviendo hacia abajo
                this.startAnimation('up');
                this.dirMovimiento = move.up;
            }

        }

        //Me fijo si cambio la posicion y si es asi emito la nueva posicion
        this.tileX = this.controlGame.layer.getTileX(this.playerSprite.x);
        this.tileY = this.controlGame.layer.getTileY(this.playerSprite.y);

        if (this.tileX != this.lastSendTileX || this.tileY != this.lastSendTileY || 
            (this.dirMovimiento == move.idle && this.lastdirMov != move.idle && this.lastMoveY == 0 && this.lastMoveX == 0 ) ) {

            this.lastSendTileX = this.tileX;
            this.lastSendTileY = this.tileY;
            this.lastdirMov = this.dirMovimiento;
            
            this.controlGame.controlServer.socket.emit('move player', { x: this.tileX, y: this.tileY, dirMov: this.dirMovimiento });
        }
       
    }

    public moveKeyPress(key:Phaser.Key) {
 
        //me fijo que tecla toco
        if (key.keyCode == Phaser.Keyboard.W)
        {
            this.seMueveY = true;
            this.lastMoveY = -1;
        }
        else if (key.keyCode == Phaser.Keyboard.S)
        {
            this.seMueveY = true;
            this.lastMoveY = 1;
        }
        else if (key.keyCode == Phaser.Keyboard.A)
        {
            this.seMueveX = true;
            this.lastMoveX = -1;
        }
        else if (key.keyCode == Phaser.Keyboard.D)
        {
            this.seMueveX = true;
            this.lastMoveX = 1;
        }

    }

     public moveKeyRelease(key:Phaser.Key) {

        //me fijo que tecla solto
        if (key.keyCode == Phaser.Keyboard.W)
        {
            this.seMueveY = false;
        }
        else if (key.keyCode == Phaser.Keyboard.S)
        {
            this.seMueveY = false;
        }
        else if (key.keyCode == Phaser.Keyboard.A)
        {
            this.seMueveX = false;
        }
        else if (key.keyCode == Phaser.Keyboard.D)
        {
            this.seMueveX = false;
        }
    


    }


}