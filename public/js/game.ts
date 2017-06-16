
class SimpleGame {

    public game: Phaser.Game;

    constructor() {

        var conf = {
            width: 1200,
            height: 675,
            renderer: Phaser.AUTO,
            parent: 'content',
            state: null,
            enableDebug: false,
        };

        this.game = new Phaser.Game(conf);

        //this.game = new Phaser.Game(1200, 675, Phaser.CANVAS, 'content', null);

        

        this.game.state.add('boot', boot, false);
        this.game.state.add('preloader', preloader, false);
        this.game.state.add('mainMenu', mainMenu, false);

        this.game.state.start('boot');

    }


} //fin
window.onload = () => {

    var game = new SimpleGame();

};

