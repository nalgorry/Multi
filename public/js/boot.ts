class boot extends Phaser.State {

    preload() {
    
                this.load.image('preloadBar', 'assets/preloader.png');
    
            }
    
    create() {

        //  Unless you specifically need to support multitouch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;


        //controlo que aparezca en todo el navegador.
        if (this.game.device.desktop == false) {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.windowConstraints.right = 'layout';
            this.game.scale.windowConstraints.bottom = 'layout';
            //this.game.scale.forceLandscape = true;
        } else {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 500;
            this.game.scale.maxWidth = 1200;
            this.game.scale.maxHeight = 675;

        } 

        this.game.scale.pageAlignHorizontally = true;

        if (this.game.device.desktop) {
            //  If you have any desktop specific settings, they can go in here
            
        }
        else {
            //  Same goes for mobile settings.
        }

        this.game.state.start('preloader', true, false);

    }

}

