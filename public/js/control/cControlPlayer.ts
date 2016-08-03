enum move {
    up = Phaser.Keyboard.W,
    down = Phaser.Keyboard.S,
    left = Phaser.Keyboard.A,
    right = Phaser.Keyboard.D,
    none = 0
    }

class cControlPlayer extends cBasicActor {
    

    public idServer: string;
    
    public lastSendTileX: number;
    public lastSendTileY: number;
    public life:number;
    private speedplayer: number = 150;
    
    private lastMoveX: number = 0;
    private lastMoveY: number = 0;
    private seMueveX:Boolean = false;
    private seMueveY:Boolean = false;

    private lastMove:move
    private secondMove:move //permito que toque dos teclas a la vez
    
    private gridSize: number;

    //texto para mostrar daño (temporal)
    style = { font: "15px Arial", fill: "#ff0044"};
    hitText:Phaser.Text = this.controlGame.game.add.text(0, 0,"Trata de golpear a alguien",this.style);
    
    constructor(controlGame:cControlGame) {
        super(controlGame);

        this.startPlayer();
        this.gridSize = controlGame.gridSize;
    }

    public startPlayer() {

        //esto no se si tendria que hacerlo aca
        this.playerSprite = this.controlGame.game.add.sprite(0, 0, 'player',2);
        this.playerSprite.anchor.set(0.5);

        this.controlGame.game.physics.arcade.enable(this.playerSprite);
        
        this.playerSprite.body.collideWorldBounds = true;
        this.playerSprite.body.width = this.controlGame.gridSize;
        this.playerSprite.body.height =this.controlGame.gridSize;
        this.playerSprite.body.offset.y =this.playerSprite.height - this.controlGame.gridSize;
        
        this.life = 100; //esto vendria de algun server no?

        this.controlGame.game.camera.follow(this.playerSprite);

        this.controlGame.depthGroup.add(this.playerSprite);

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

        //animaciones
        this.playerSprite.animations.add('run', [1], 10, true);
        this.playerSprite.animations.add('idle', [1], 2, true);

    }

    public playerHit(data) {

        this.life -= data.damage;
        this.onHit(data);

    }

    public youHit(data) {
        this.hitText.text = "Golpeaste a alguien por " + data.damage;
    }

    public youDie(data) {

        this.playerSprite.x = 0;
        this.playerSprite.y = 0;
        this.life = 100;
    }

    public youKill(data) {

    }

    public moveKeyRelease(key:Phaser.Key) {
    
        if (this.lastMove == key.keyCode) {

            if (key.keyCode == Phaser.Keyboard.W || key.keyCode == Phaser.Keyboard.S) {
                this.playerSprite.body.velocity.y = 0;
                this.seMueveY = false;
            }

            if (key.keyCode == Phaser.Keyboard.A || key.keyCode == Phaser.Keyboard.D) {
                this.playerSprite.body.velocity.x = 0;
                this.seMueveX = false 
            }

            this.lastMove = this.secondMove;
            this.secondMove = move.none;
        } else if (this.secondMove == key.keyCode) {
            this.secondMove = move.none;
        }

    }

    public playerUpdate() {

        //if (this.lastMoveX == 0) {
            if (this.lastMove == move.up) {
                this.playerSprite.body.velocity.y = -this.speedplayer;
            } else if (this.lastMove == move.down) {
                this.playerSprite.body.velocity.y = this.speedplayer;
            } 
        //}
        
        //if (this.lastMoveY == 0) { esto evita el movimiento en diagonal
            if (this.lastMove == move.left) {
                this.playerSprite.body.velocity.x = -this.speedplayer;
            } else if (this.lastMove == move.right) {
                this.playerSprite.body.velocity.x = this.speedplayer;
            }
        //}

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
                }
            }
        } 

        //Me fijo si cambio la posicion y si es asi emito la nueva posicion
        this.tileX = this.controlGame.layer.getTileX(this.playerSprite.x);
        this.tileY = this.controlGame.layer.getTileY(this.playerSprite.y);

        if (this.tileX != this.lastSendTileX || this.tileY != this.lastSendTileY) {

            //me fijo para que lado me movi, para enviarle al servidor
            var dirMovimiento:number; // 0 arriba, 1 izquierda, 2 abajo, 3 derecha
            if (this.tileX > this.lastSendTileX) {
                dirMovimiento = 3;
            } else if (this.tileX < this.lastSendTileX) {
                dirMovimiento = 1;
            } else if (this.tileY < this.lastSendTileY) {
                dirMovimiento = 0;
            } else if (this.tileY > this.lastSendTileY) {
                dirMovimiento = 2;
            }

            this.lastSendTileX = this.tileX;
            this.lastSendTileY = this.tileY;
            
            this.controlGame.controlServer.socket.emit('move player', { x: this.tileX, y: this.tileY, dirMov: dirMovimiento });
        } 
    }

    public moveKeyPress(key:Phaser.Key) {
 
        this.playerSprite.body.velocity.y = 0;
        this.playerSprite.body.velocity.x = 0;
        
        var actualMove:move = key.keyCode;

        if (this.lastMove != actualMove) {
            this.secondMove = this.lastMove;
            this.lastMove = actualMove;
            this.seMueveX = false;
            this.seMueveY = false;
        }
       
        //me fijo si tengo que mover el jugador
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

        //control de las animaciones
        if (this.lastMoveX == 0 && this.lastMoveY == 0) {
            this.playerSprite.animations.play('idle');
        }
        if (this.lastMoveX == 1) { //se esta moviendo hacia la derecha
            this.playerSprite.animations.play('run');
        }
        if (this.lastMoveX == -1) { //se esta moviendo hacia la izquierda
            this.playerSprite.animations.play('run');
        }

    }

}