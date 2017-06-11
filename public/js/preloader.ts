class preloader extends Phaser.State {

    preloadBar: Phaser.Sprite;

    preload() {

        //  Set-up our preloader sprite
        this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
        this.load.setPreloadSprite(this.preloadBar);

        //  Load our actual games assets
        this.game.load.image('monster_1', 'assets/monster_1.png');

        //all the maps of the game 
        this.game.load.tilemap('principalMap', 'assets/maps/principalMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('firstMap', 'assets/maps/firstMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('tutorialMap', 'assets/maps/tutorialMap.json', null, Phaser.Tilemap.TILED_JSON);

        //all the objets
        this.game.load.image('tiles', 'assets/maps/tiles.png');
        this.game.load.spritesheet('boom', 'assets/explosion.png',50,50);
        this.game.load.spritesheet('boom2', 'assets/explosion2.png',96,96);
        this.game.load.spritesheet('boom3', 'assets/explosion3.png',192,173);
        this.game.load.spritesheet('boom4', 'assets/blueexplosion.png',66.66,66.66);
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
        this.game.load.spritesheet('portal', 'assets/portal.png', 128, 64 );       

        this.game.load.atlasJSONHash('pj', 'assets/pj.png', 'assets/pj.json');

        this.game.load.spritesheet('items', 'assets/items.png',40,40);

        this.game.load.image('atackDefense', 'assets/atack_defense.png');

        this.game.load.image('controls', 'assets/controls.png');        
        this.game.load.image('help_arrow', 'assets/help_arrow.png');
        this.game.load.image('help_arrow_2', 'assets/help_arrow_2.png');
        this.game.load.image('help_arrow_3', 'assets/help_arrow_3.png');

        this.game.load.image('parlante', 'assets/parlante.png');

        this.game.load.bitmapFont('gotic', 'assets/showg_black.png', 'assets/showg_black.fnt');
        this.game.load.bitmapFont('gotic_white', 'assets/showg_white.png', 'assets/showg_white.fnt');
        
        this.game.load.audio('run', 'assets/sounds/run.ogg');
        this.game.load.audio('basic_hit', 'assets/sounds/basic_hit.ogg');
        this.game.load.audio('heal_spell', 'assets/sounds/heal_spell.ogg');
        this.game.load.audio('lighting_spell', 'assets/sounds/lighting_hit.ogg');
        this.game.load.audio('shield_spell', 'assets/sounds/shield_spell.ogg');
        this.game.load.audio('item_get', 'assets/sounds/item_get.ogg');
        this.game.load.audio('item_drop', 'assets/sounds/item_drop.ogg');
        this.game.load.audio('item_equip', 'assets/sounds/item_equip.ogg');
        this.game.load.audio('self_explosion', 'assets/sounds/self_explosion.ogg');
        this.game.load.audio('hit1', 'assets/sounds/hit1.ogg');
        this.game.load.audio('hit2', 'assets/sounds/hit2.ogg');
        this.game.load.audio('die', 'assets/sounds/die1.ogg');
        
    }

    create() {

        var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startMainMenu, this);

    }

    startMainMenu() {

        this.game.state.start('mainMenu', true, false);

    }

}