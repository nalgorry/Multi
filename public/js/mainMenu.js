var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mainMenu = (function (_super) {
    __extends(mainMenu, _super);
    function mainMenu() {
        _super.apply(this, arguments);
    }
    mainMenu.prototype.create = function () {
        //inicio todos los parametros dele juego
        this.controlGame = new cControlGame(this.game);
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
        this.controlChat = new cControlChat(this.controlGame, this.controlPlayer, this.controlOtherPlayers);
        //inicio el servidor
        this.controlServer = new cControlServer(this.controlPlayer, this.controlGame, this.controlOtherPlayers, this.controlChat);
        this.controlGame.controlServer = this.controlServer;
        this.controlChat.controlServer = this.controlServer;
        this.controlGame.controlOtherPlayers = this.controlOtherPlayers;
    };
    mainMenu.prototype.update = function () {
        this.controlGame.game.physics.arcade.collide(this.controlPlayer.playerSprite, this.controlGame.hitLayer);
        this.controlPlayer.playerUpdate();
        this.controlGame.updateZDepth();
    };
    mainMenu.prototype.render = function () {
        var showElements = true;
        if (showElements == true) {
            //this.game.debug.cameraInfo(this.game.camera, 50, 500);
            //this.game.debug.spriteCoords(this.controlPlayer.playerSprite, 50, 500);
            var x = this.controlGame.layer.getTileX(this.controlPlayer.playerSprite.body.x);
            var y = this.controlGame.layer.getTileY(this.controlPlayer.playerSprite.body.y);
            var tile = this.controlGame.map.getTile(x, y, this.controlGame.layer);
            this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
            //this.game.debug.text("vida: " + this.controlPlayer.controlFocus.life.toString(),800,120)
            this.game.debug.text('Tile X: ' + this.controlGame.controlPlayer.tileX, 50, 48, 'rgb(0,0,0)');
            this.game.debug.text('Tile Y: ' + this.controlGame.controlPlayer.tileY, 50, 64, 'rgb(0,0,0)');
            //this.game.debug.bodyInfo(this.controlPlayer.playerSprite, 50, 50);
            //this.game.debug.body(this.controlPlayer.playerSprite);
            //this.game.debug.body(this.controlMonsters.spriteAreaAtack);
            //this.game.debug.geom(this.controlGame.point, 'rgb(0,255,0)');
            var pos = this.controlGame.game.input.activePointer.position;
            this.controlGame.game.debug.text("x:" + pos.x + " y:" + pos.y, 180, 15);
        }
    };
    return mainMenu;
}(Phaser.State));
