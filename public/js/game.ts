
class SimpleGame {

    public game: Phaser.Game;

    controlPlayer: cControlPlayer ; //clase que controla al jugador
    controlGame: cControlGame ; //aca van todos los datos relacionados con el juego
    controlOtherPlayers: cControlOtherPlayers; //clase que controla los otros jugadores
    controlServer: cControlServer; //clase que controla el servidor
    controlChat: cControlChat; //clase que controla el chat

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
        this.game.load.image('tiles', 'assets/tiles2.png');
        this.game.load.image('logo', 'assets/phaser.png');
        this.game.load.image('bat', 'assets/bat.png');
        this.game.load.image('tree', 'assets/tree.jpg');
        this.game.load.image('earth', 'assets/scorched_earth.png');
        this.game.load.spritesheet('player', 'assets/charmander48x44.png', 40,40 );
    }

    create() {
        
        //inicio todos los parametros dele juego
        this.controlGame = new cControlGame(this.game)
        this.game.add.plugin(Fabrique.Plugins.InputField);

        //para medir los tiempos
        this.game.time.advancedTiming = true;
        
        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, 60*this.controlGame.gridSize, 60*this.controlGame.gridSize);
        
        //inicio el jugador principal
        this.controlPlayer = new cControlPlayer(this.controlGame);

        //inicio los jugadores enemigos
        this.controlOtherPlayers = new cControlOtherPlayers(this.controlGame);

        //inicio el chat
        this.controlChat = new cControlChat(this.controlGame,this.controlPlayer,this.controlOtherPlayers);

        //inicio el servidor
        this.controlServer = new cControlServer(this.controlPlayer,this.controlGame,
            this.controlOtherPlayers,this.controlChat);
        this.controlGame.controlServer = this.controlServer;
        this.controlChat.controlServer = this.controlServer

        
    }

    update() {
        
        this.controlPlayer.updatePlayer(this.controlGame.cursors,this.controlGame.layer,this.controlServer.socket);
        
        this.controlGame.updateZDepth();

        var enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enter.onDown.add(this.controlChat.enterPress,this.controlChat);
        
    }


    render() {
        //this.game.debug.cameraInfo(this.game.camera, 50, 50);
        //this.game.debug.spriteCoords(this.controlPlayer.playerSprite, 50, 500);
        
        
        var x = this.controlGame.layer.getTileX(this.controlPlayer.playerSprite.body.x);
        var y = this.controlGame.layer.getTileY(this.controlPlayer.playerSprite.body.y);
        var tile = this.controlGame.map.getTile(x,y,this.controlGame.layer);
        
        this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");

        this.game.debug.text("vida: " + this.controlPlayer.life.toString(),100,100)

        //this.game.debug.text('Tile X: ' + this.layer.getTileX(this.player.x), 50, 48, 'rgb(0,0,0)');
        //this.game.debug.text('Tile Y: ' + this.layer.getTileY(this.player.y), 50, 64, 'rgb(0,0,0)');

        this.game.debug.bodyInfo(this.controlPlayer.playerSprite, 50, 50);
        this.game.debug.body(this.controlPlayer.playerSprite);

    }

} //fin
window.onload = () => {

    var game = new SimpleGame();

};

