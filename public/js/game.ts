
class SimpleGame {

    public game: Phaser.Game;

    controlPlayer: cControlPlayer ; //clase que controla al jugador
    controlGame: cControlGame ; //aca van todos los datos relacionados con el juego
    controlOtherPlayers: cControlOtherPlayers; //clase que controla los otros jugadores
    controlServer: cControlServer; //clase que controla el servidor
    controlChat: cControlChat; //clase que controla el chat
    controlMonsters: cControlMonsters; //clase que controla los monstruos

    constructor() {

        this.game = new Phaser.Game(1200, 675, Phaser.CANVAS, 'content', 
        { 
            preload: this.preload, 
            create: this.create,
            update: this.update,
            render: this.render
        });

    }

    preload() {
        this.game.load.tilemap('map', 'assets/map1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.spritesheet('boom', 'assets/explosion.png',50,50);
        this.game.load.spritesheet('boom2', 'assets/explosion2.png',96,96);
        this.game.load.spritesheet('boom3', 'assets/blueexplosion.png',66.66,66.66);

        //this.game.load.spritesheet('aura', 'assets/aura80.png',70,80);
        //this.game.load.spritesheet('aura2', 'assets/aura2.png',20,20);
        this.game.load.spritesheet('aura', 'assets/aura38.png',128,128);

        this.game.load.spritesheet('player', 'assets/char_test40.png', 40,70 );
        this.game.load.atlas('objects', 'assets/objects.png','assets/objects.json');
        this.game.load.spritesheet('spells', 'assets/spells.png', 40,40 );

        this.game.load.spritesheet('monster_1', 'assets/monster_1.png', 40,80 );
        this.game.load.spritesheet('monster_2', 'assets/monster_2.png',170 ,119 );
        

        this.game.load.spritesheet('interfaz', 'assets/interfaz.png', 200,675 );
        this.game.load.spritesheet('weapon1', 'assets/weapon1.png', 120,120 );
        this.game.load.spritesheet('portal', 'assets/portal.png', 70,116 );       

        this.game.load.atlasJSONHash('pj', 'assets/pj.png', 'assets/pj.json');


}

    create() {
        
        //inicio todos los parametros dele juego
        this.controlGame = new cControlGame(this.game)
        this.game.add.plugin(Fabrique.Plugins.InputField);

        //para medir los tiempos
        this.game.time.advancedTiming = true;
        
        //inicio el jugador principal
        this.controlPlayer = new cControlPlayer(this.controlGame);
        this.controlGame.controlPlayer = this.controlPlayer;

        //inicio los jugadores enemigos
        this.controlOtherPlayers = new cControlOtherPlayers(this.controlGame);

        //inicio los monstruos
        this.controlMonsters = new cControlMonsters(this.controlGame);
        this.controlGame.controlMonsters = this.controlMonsters;

        //inicio el chat
        this.controlChat = new cControlChat(this.controlGame,this.controlPlayer,this.controlOtherPlayers);

        //inicio el servidor
        this.controlServer = new cControlServer(this.controlPlayer,this.controlGame,
        this.controlOtherPlayers,this.controlChat);
        this.controlGame.controlServer = this.controlServer;
        this.controlChat.controlServer = this.controlServer;
        
    }

    update() {
        
        this.controlGame.game.physics.arcade.collide(this.controlPlayer.playerSprite, this.controlGame.hitLayer);

        this.controlPlayer.playerUpdate();
        this.controlGame.updateZDepth();
        
    }


    render() {
        //this.game.debug.cameraInfo(this.game.camera, 50, 500);
        //this.game.debug.spriteCoords(this.controlPlayer.playerSprite, 50, 500);
        
        
        var x = this.controlGame.layer.getTileX(this.controlPlayer.playerSprite.body.x);
        var y = this.controlGame.layer.getTileY(this.controlPlayer.playerSprite.body.y);
        var tile = this.controlGame.map.getTile(x,y,this.controlGame.layer);
        
        this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");

        //this.game.debug.text("vida: " + this.controlPlayer.controlFocus.life.toString(),800,120)

        this.game.debug.text('Tile X: ' + this.controlGame.layer.getTileX(this.controlGame.controlPlayer.playerSprite.x), 50, 48, 'rgb(0,0,0)');
        this.game.debug.text('Tile Y: ' + this.controlGame.layer.getTileY(this.controlGame.controlPlayer.playerSprite.y), 50, 64, 'rgb(0,0,0)');
        
        //this.game.debug.bodyInfo(this.controlPlayer.playerSprite, 50, 50);
        //this.game.debug.body(this.controlPlayer.playerSprite);
        //this.game.debug.body(this.controlMonsters.spriteAreaAtack);

        //this.game.debug.geom(this.controlGame.point, 'rgb(0,255,0)');

        var pos = this.controlGame.game.input.activePointer.position;
        this.controlGame.game.debug.text("x:" + pos.x + " y:" + pos.y, 180, 15);

    }

} //fin
window.onload = () => {

    var game = new SimpleGame();

};

