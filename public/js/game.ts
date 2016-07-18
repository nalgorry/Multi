
class SimpleGame {
    game: Phaser.Game;
    map: Phaser.Tilemap;
    land: Phaser.TileSprite;
    layer: Phaser.TilemapLayer;
    cursors: Phaser.CursorKeys;
    
    marker; //to get the mouse
    
    //esto genera los vampiros
    Enemies: Phaser.Group;
    bat: Phaser.Sprite;

    socket:SocketIOClient.Socket; // Socket connection

    dataPlayer: cThisPlayerData; //clase que controla al jugador
    dataOtherPlayers: cOtherPlayerData[]; //clase que controla los demas jugadores
    
    //variables creadas por mi
    gridSize: number;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'content', 
        { 
            preload: this.preload, 
            create: this.create,
            update: this.update,
            render: this.render
        });
    }

    preload() {
        this.game.load.tilemap('map', 'assets/maze.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.image('player', 'assets/fermat8.png');
        this.game.load.image('logo', 'assets/phaser.png');
        this.game.load.image('bat', 'assets/bat.png');
        this.game.load.image('tree', 'assets/tree.jpg');
        
        this.game.load.image('earth', 'assets/scorched_earth.png');
    }

    create() {
        //para hacerlo multiplayer :)
        this.socket = io.connect();

        // Socket connection successful
        this.socket.on('connect', SimpleGame.prototype.onSocketConnected.bind(this));

        // Socket disconnection
        this.socket.on('disconnect', SimpleGame.prototype.onSocketDisconnect.bind(this));

        // New player message received
        this.socket.on('new player', SimpleGame.prototype.onNewPlayer.bind(this));

        // Player move message received
        this.socket.on('move player', SimpleGame.prototype.onMovePlayer.bind(this));

        // Player removed message received
        this.socket.on('remove player', SimpleGame.prototype.onRemovePlayer.bind(this));

        // Player removed message received
        this.socket.on('player git', SimpleGame.prototype.onPlayerGit.bind(this));

        //para medir los tiempos
        this.game.time.advancedTiming = true;
        
        //inicio parametros del juego
        this.gridSize = 32;

        // To cotrol the mouses events
        this.game.input.onDown.add(SimpleGame.prototype.mouseDown,this);
        this.game.input.addMoveCallback(SimpleGame.prototype.mouseMove,this);

        //  Our tiled scrolling background
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.setCollision(20, true, this.layer);
        this.game.stage.disableVisibilityChange = true;

        
        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, 1920, 1920);
        //this.game.world.centerX
        
        //inicio el jugador principal
        this.dataPlayer = new cThisPlayerData();
        this.dataPlayer.game = this.game;
        this.dataPlayer.startPlayer();

        //inicio los jugadores enemigos
        this.dataOtherPlayers = [];

        //esto controla el teclado
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //  Para hacer un recuadro donde esta el mouse
        this.marker = this.game.add.graphics(0,0);
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, 32, 32);

        // create 8 bats
        this.Enemies = this.game.add.group();
        this.Enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.Enemies.enableBody = true;

        this.Enemies.classType = Character;
        this.Enemies.createMultiple(30, "bat");
        this.Enemies.forEach(function (Enemy: Character) {
        // setup movements and animations
        Enemy.SetUp(this);
        
        }, this);

    }

    update() {

        this.game.physics.arcade.collide(this.dataPlayer.playerSprite, this.layer);
        this.dataPlayer.updatePlayer(this.cursors,this.layer,this.socket);
        
    }

    render() {
        //this.game.debug.cameraInfo(this.game.camera, 32, 32);
        //this.game.debug.spriteCoords(this.dataPlayer.playerSprite, 32, 500);
        
        var x = this.layer.getTileX(this.dataPlayer.playerSprite.body.x);
        var y = this.layer.getTileY(this.dataPlayer.playerSprite.body.y);
        var tile = this.map.getTile(x,y,this.layer);
        
        this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");

        this.game.debug.text("vida: " + this.dataPlayer.life.toString(),100,100)

        //this.game.debug.text('Tile X: ' + this.layer.getTileX(this.player.x), 32, 48, 'rgb(0,0,0)');
        //this.game.debug.text('Tile Y: ' + this.layer.getTileY(this.player.y), 32, 64, 'rgb(0,0,0)');

        this.game.debug.bodyInfo(this.dataPlayer.playerSprite, 32, 32);
        this.game.debug.body(this.dataPlayer.playerSprite);

    }

    mouseDown(event:MouseEvent) {

        var tileX:number = this.layer.getTileX(this.game.input.activePointer.worldX);
        var tileY:number = this.layer.getTileY(this.game.input.activePointer.worldY);

        this.socket.emit('mouse click', { x: tileX, y: tileY });
    }

    mouseMove(pointer:Phaser.Pointer, x:number, y:number ,a:boolean) {
        this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * this.gridSize;
        this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * this.gridSize;
    }

    // Socket connected
    public onSocketConnected()  {
        console.log('Connected to socket server');

        this.dataPlayer.idServer = "/#" + this.socket.id;
        console.log(this.dataPlayer.idServer);

        this.socket.emit('new player', { x: this.layer.getTileX(this.dataPlayer.playerSprite.x), y: this.layer.getTileY(this.dataPlayer.playerSprite.y) });
    }

    // Socket disconnected
    onSocketDisconnect () {
        console.log('Disconnected from socket server');
    }

    // New player
    onNewPlayer (data) {
        console.log('New player connected:', data.id);
        //console.log(data);

        var newPlayer = new cOtherPlayerData;
        newPlayer.game = this.game;
        newPlayer.id = data.id;
        newPlayer.tileX = data.x;
        newPlayer.tileY = data.y;
        newPlayer.IniciarJugador();

        this.dataOtherPlayers.push(newPlayer);

    }

    // Move player
    onMovePlayer (data) {
        
        // Find player by ID
        var movedPlayer:cOtherPlayerData;
        for (var i = 0; i < this.dataOtherPlayers.length; i++) {
            if (this.dataOtherPlayers[i].id === data.id) {
                movedPlayer = this.dataOtherPlayers[i];
                break;
            }
        }

        movedPlayer.MoverJugador(data)

    }

     // Move player
    onPlayerGit (data) {
        console.log (data.damage);

        console.log(data.id );
        console.log(this.dataPlayer.idServer);
        if (data.id === this.dataPlayer.idServer) {
            this.dataPlayer.life -= data.damage;
            console.log("entra");
        }

    }

    // Remove player
    onRemovePlayer (data) {

        var playerToRemove = SimpleGame.prototype.playerById(this,data.id);

        if (playerToRemove != null) {
            playerToRemove.removePlayer()
            this.dataOtherPlayers.splice(this.dataOtherPlayers.indexOf(playerToRemove), 1)
        }

        console.log(playerToRemove);

    }

    playerById (simpleGame:SimpleGame,id:Text): cOtherPlayerData {
        var i:number;
        
        for (i = 0; i < simpleGame.dataOtherPlayers.length; i++) {
            if (simpleGame.dataOtherPlayers[i].id === id) {
                return simpleGame.dataOtherPlayers[i];
            }
        }

        return null
    }



} //fin
window.onload = () => {

    var game = new SimpleGame();

};

