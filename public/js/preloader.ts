class preloader extends Phaser.State {

    preloadBar: Phaser.Sprite;

    preload() {

        //  Set-up our preloader sprite
        this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
        this.load.setPreloadSprite(this.preloadBar);

        //  Load our actual games assets
        this.game.load.image('monster_1', 'assets/monster_1.png');

        this.game.load.tilemap('map', 'assets/map1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.spritesheet('boom', 'assets/explosion.png',50,50);
        this.game.load.spritesheet('boom2', 'assets/explosion2.png',96,96);
        this.game.load.spritesheet('boom3', 'assets/blueexplosion.png',66.66,66.66);
        this.game.load.spritesheet('aura', 'assets/aura_escudo.png',128,128);

        this.game.load.spritesheet('player', 'assets/char_test40.png', 40,70 );
        this.game.load.atlas('objects', 'assets/objects.png','assets/objects.json');
        this.game.load.spritesheet('spells', 'assets/spells.png', 50, 50 );

        
        this.game.load.spritesheet('monster_2', 'assets/monster_2.png',170 ,119 );
        this.game.load.image('monster_3', 'assets/monster_3.png' );
        this.game.load.image('monster_4', 'assets/monster_4.png' );
        this.game.load.image('monster_5', 'assets/cosmic_monster.png' );
        

        this.game.load.spritesheet('interfaz', 'assets/interfaz.png', 200,675 );
        this.game.load.spritesheet('weapon1', 'assets/weapon1.png', 120,120 );
        this.game.load.spritesheet('portal', 'assets/portal.png', 70,116 );       

        this.game.load.atlasJSONHash('pj', 'assets/pj.png', 'assets/pj.json');

        this.game.load.spritesheet('items', 'assets/items.png',40,40);

        this.game.load.image('atackDefense', 'assets/atack_defense.png');

        this.game.load.image('controls', 'assets/controls.png');        
        this.game.load.image('help_arrow', 'assets/help_arrow.png');
        this.game.load.image('help_arrow_2', 'assets/help_arrow_2.png');
        this.game.load.image('help_arrow_3', 'assets/help_arrow_3.png');

        this.game.load.bitmapFont('gotic', 'assets/font.png', 'assets/font.fnt');
         

    }

    create() {

        var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startMainMenu, this);

    }

    startMainMenu() {

        this.game.state.start('mainMenu', true, false);

    }

}