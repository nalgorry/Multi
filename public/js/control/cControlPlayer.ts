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

    public controlFocus: cControlFocus;
    public controlSpells:cControlSpells;

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
    hitText:Phaser.Text = this.controlGame.game.add.text(0, 15,"Trata de golpear a alguien",this.style);
    
    constructor(controlGame:cControlGame) {
        super(controlGame);

        this.startPlayer();
        this.gridSize = controlGame.gridSize;

        this.hitText.fixedToCamera = true;
    }

    public startPlayer() {

        //esto no se si tendria que hacerlo aca
        this.playerSprite = this.controlGame.game.add.sprite(1000, 1000);
        this.playerSprite.anchor.set(0.5,1);
        this.playerSprite.x += this.playerSprite.width/2;

        //creo el cuerpo con su armadura
        this.armorSprite = this.controlGame.game.add.sprite(0, 0, 'player',0);
        this.armorSprite.anchor.set(0.5,1);
        this.playerSprite.addChild(this.armorSprite);

        //creo el arma
        this.weaponSprite = this.controlGame.game.add.sprite(0, 0, 'weapon1',0);
        this.weaponSprite.anchor.set(0.5,1);
        this.playerSprite.addChild(this.weaponSprite);

        //seteo el z del arma para poder swapear facilmente
        this.armorSprite.z =3;
        this.weaponSprite.z =4;
        this.playerSprite.children.sort();

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

        //defino las animaciones segun la cantidad de cuadros 

        this.armorSprite.animations.add('idle',[0,1,2,3,4], 4, true);
        this.armorSprite.animations.add('left', [8,9,10,11,12,13,14,15], 10, true);
        this.armorSprite.animations.add('right', [16,17,18,19,20,21,22,23], 10, true);
        this.armorSprite.animations.add('up', [24,25,26,27,28], 10, true);
        this.armorSprite.animations.add('down', [32,33,34,35,36], 10, true);

        this.weaponSprite.animations.add('idle',[0,1,2,3,4], 4, true);
        this.weaponSprite.animations.add('left', [8,9,10,11,12,13,14,15], 10, true);
        this.weaponSprite.animations.add('right', [16,17,18,19,20,21,22,23], 10, true);
        this.weaponSprite.animations.add('up', [24,25,26,27,28], 10, true);
        this.weaponSprite.animations.add('down', [32,33,34,35,36], 10, true);

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

        //control de las animaciones
        if (this.lastMoveX == 0 && this.lastMoveY == 0) {
            this.armorSprite.animations.play('idle');
            this.weaponSprite.animations.play('idle');
        }
        if (this.lastMoveX == 1) { //se esta moviendo hacia la derecha
            this.armorSprite.animations.play('right');
            this.weaponSprite.animations.play('right');
            this.weaponSprite.z = 9;
        }
        if (this.lastMoveX == -1) { //se esta moviendo hacia la izquierda
            this.armorSprite.animations.play('left');
            this.weaponSprite.animations.play('left');
        }
        if (this.lastMoveY == 1) { //se esta moviendo hacia arriba
            this.armorSprite.animations.play('up');
            this.weaponSprite.animations.play('up');
        }
        if (this.lastMoveY == -1) { //se esta moviendo hacia abajo
            this.armorSprite.animations.play('down');
            this.weaponSprite.animations.play('down');
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

    }

}