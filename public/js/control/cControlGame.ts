class cControlGame {
    
    public game: Phaser.Game;
    public gridSize: number;
    public map: Phaser.Tilemap;
    public land: Phaser.TileSprite;
    public layer: Phaser.TilemapLayer;
    public hitLayer: Phaser.TilemapLayer;
    public cursors: Phaser.CursorKeys;
    public controlServer: cControlServer;
    public depthGroup:Phaser.Group;
    public interfaz:Phaser.Sprite;
    public atackMode:boolean;
    interfazWidth:number;
    marker; //to get the mouse
    point;

    //barras del jugador
    barraVida:Phaser.Sprite
    barraMana:Phaser.Sprite
    barraEnergia:Phaser.Sprite
    barraExp:Phaser.Sprite

    constructor(_game:Phaser.Game) {
        this.game = _game;

        //inicio parametros del juego
        this.gridSize = 40;
        this.interfazWidth = 200;
        var tamanoMapa = 100;

        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, tamanoMapa*this.gridSize, tamanoMapa*this.gridSize);

        //  Our tiled scrolling background
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.hitLayer = this.map.createLayer('HitTest',this.game.width - this.interfazWidth);
        this.layer = this.map.createLayer('FirstFloor',this.game.width - this.interfazWidth);
        this.layer = this.map.createLayer('SecondFloor',this.game.width - this.interfazWidth);
        this.map.setCollision(802, true, this.hitLayer );
        this.game.stage.disableVisibilityChange = true;

        //inicio el grupo de profundidad
        this.depthGroup = this.game.add.group(); //  To control the depth of the characters      

         //creo los objetos a partir de los datos del mapa
        this.map.createFromObjects('Objetos', 1601, 'objects', 'arbol1.png', true, true, this.depthGroup,undefined,false);
        this.map.createFromObjects('Objetos', 1602, 'objects', 'roca1.png', true, true, this.depthGroup,undefined,false);

        this.depthGroup.forEach(this.ObjectsConfiguration,this)

        //cargo la interfaz dele juego
        this.interfaz = this.game.add.sprite(this.game.width - this.interfazWidth , 0, 'interfaz');
        this.interfaz.inputEnabled = true;
        this.interfaz.events.onInputDown.add(this.atackKeyOne, this);
        this.interfaz.fixedToCamera = true;
        //boton.cameraOffset.setTo(100, 560);

        var graphics = this.game.add.graphics(100, 100);
        graphics.drawRect(50, 250, 100, 100);

        //creo las barras de vida y energia 
      
        //vida
        var bitmapVida = this.game.add.bitmapData(24, 130);
        bitmapVida.ctx.beginPath();
        bitmapVida.ctx.rect(0, 0, 24, 130);
        bitmapVida.ctx.fillStyle = '#e33133';
        bitmapVida.ctx.fill();
        this.barraVida = this.game.add.sprite(810 + bitmapVida.width, 125 + bitmapVida.height,bitmapVida);
        this.barraVida.anchor.setTo(1);
        this.barraVida.fixedToCamera = true;

        //mana
        var bitmapMana = this.game.add.bitmapData(24, 130);
        bitmapMana.ctx.beginPath();
        bitmapMana.ctx.rect(0, 0, 24, 130);
        bitmapMana.ctx.fillStyle = '#0099ff';
        bitmapMana.ctx.fill();
        var mana = this.game.add.sprite(854 + bitmapMana.width, 125 + bitmapMana.height,bitmapMana);
        mana.anchor.setTo(1);
        mana.fixedToCamera = true;

        //energia
        var bitmapEnergia = this.game.add.bitmapData(25, 130);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, 24, 130);
        bitmapEnergia.ctx.fillStyle = '#33cc66';
        bitmapEnergia.ctx.fill();
        var energia = this.game.add.sprite(897 + bitmapEnergia.width, 125 + bitmapEnergia.height,bitmapEnergia);
        energia.anchor.setTo(1);
        energia.fixedToCamera = true;

        //exp
        var bitmapExp = this.game.add.bitmapData(25, 130);
        bitmapExp.ctx.beginPath();
        bitmapExp.ctx.rect(0, 0, 24, 130);
        bitmapExp.ctx.fillStyle = '#cc33cc';
        bitmapExp.ctx.fill();
        var exp = this.game.add.sprite(954 + bitmapExp.width,125 + bitmapExp.height,bitmapExp);
        exp.anchor.setTo(1);
        exp.fixedToCamera = true;

        
        //para testear el centro de un sprite
        this.point = new Phaser.Point(this.depthGroup.children[0].x, this.depthGroup.children[0].y);

        //  Para hacer un recuadro donde esta el mouse
        this.marker = this.game.add.graphics(0,0);
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, this.gridSize, this.gridSize);

        // To cotrol the mouses events
        this.game.input.onUp.add(this.mouseUp,this);
        this.game.input.onDown.add(this.mouseDown,this);
        this.game.input.addMoveCallback(this.mouseMove,this);

        //to control the keyboard 
        var atackKeyOne = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        atackKeyOne.onDown.add(this.atackKeyOne,this);

        //esto controla el teclado
        //this.cursors = this.game.input.keyboard.createCursorKeys();

    }

    ObjectsConfiguration (child:Phaser.Sprite) {
        child.anchor.set(0,1);
    }

    atackKeyOne(data) {
        console.log(data);
        this.game.canvas.style.cursor = 'crosshair';
        this.atackMode = true;
    }


    public updateZDepth() {
        this.depthGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    }

    public PowerTrow(data) {
        //animiacion de la bomba 
        var boomSprite = this.game.add.sprite(data.x * this.gridSize + this.gridSize/2 , data.y * this.gridSize + this.gridSize/2,'boom');    
        boomSprite.anchor.set(0.5);
        boomSprite.animations.add('boom');
        boomSprite.animations.play('boom',160,false,true);

    }

    mouseDown(event:MouseEvent) {
        this.game.canvas.style.cursor = 'default';
    }

    mouseUp(event:MouseEvent) {
    
        if (this.atackMode == true) {
            this.atackMode = false;
        }
    }

    mouseMove(pointer:Phaser.Pointer, x:number, y:number ,a:boolean) {

        this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * this.gridSize;
        this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * this.gridSize;

    }

    

}