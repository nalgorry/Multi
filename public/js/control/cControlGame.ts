class cControlGame {
    
    public game: Phaser.Game;
    public gridSize: number;
    public map: Phaser.Tilemap;
    public land: Phaser.TileSprite;
    public layer: Phaser.TilemapLayer;
    public cursors: Phaser.CursorKeys;
    public controlServer: cControlServer;
    public depthGroup:Phaser.Group;
    marker; //to get the mouse

    constructor(_game:Phaser.Game) {
        this.game = _game;

        //inicio parametros del juego
        this.gridSize = 40;

         //  Our tiled scrolling background
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.setCollision(100, true, this.layer);
        this.game.stage.disableVisibilityChange = true;

        //  Para hacer un recuadro donde esta el mouse
        this.marker = this.game.add.graphics(0,0);
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, this.gridSize, this.gridSize);

        // To cotrol the mouses events
        this.game.input.onDown.add(this.mouseDown,this);
        this.game.input.addMoveCallback(this.mouseMove,this);

        //esto controla el teclado
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //inicio el grupo de profundidad
         this.depthGroup = this.game.add.group(); //  To control the depth of the characters
    }

    public updateZDepth() {
        this.depthGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    }

    mouseDown(event:MouseEvent) {

        var tileX:number = this.layer.getTileX(this.game.input.activePointer.worldX);
        var tileY:number = this.layer.getTileY(this.game.input.activePointer.worldY);
        

        this.controlServer.socket.emit('mouse click', { x: tileX, y: tileY });
    }

    mouseMove(pointer:Phaser.Pointer, x:number, y:number ,a:boolean) {

        this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * this.gridSize;
        this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * this.gridSize;

    }

    

}