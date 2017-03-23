var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(1200, 675, Phaser.WEBGL, 'content', null);
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
