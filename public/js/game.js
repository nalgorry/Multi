var SimpleGame = (function () {
    function SimpleGame() {
        var conf = {
            width: 1200,
            height: 675,
            renderer: Phaser.CANVAS,
            parent: 'content',
            state: null,
        };
        this.game = new Phaser.Game(conf);
        this.game.state.add('boot', boot, false);
        this.game.state.add('preloader', preloader, false);
        this.game.state.add('mainMenu', mainMenu, false);
        this.game.state.start('boot');
    }
    return SimpleGame;
}()); //fin
window.onload = function () {
    var game = new SimpleGame();
};
