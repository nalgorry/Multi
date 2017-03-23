
class SimpleGame {

    public game: Phaser.Game;

    constructor() {

        this.game = new Phaser.Game(1200, 675, Phaser.WEBGL, 'content', null);

        this.game.state.add('boot', boot, false);
        this.game.state.add('preloader', preloader, false);
        this.game.state.add('mainMenu', mainMenu, false);

        this.game.state.start('boot');

    }


} //fin
window.onload = () => {

    var game = new SimpleGame();

};

