var cControlSounds = (function () {
    function cControlSounds(controlGame) {
        this.controlGame = controlGame;
        this.numberPlayerHit = 1;
        this.masterVolume = 1;
        this.soundReady = false;
        this.game = controlGame.game;
        //cargo los sonidos
        this.run = this.game.add.audio('run');
        this.basicHit = this.game.add.audio('basic_hit');
        this.healSpell = this.game.add.audio('heal_spell');
        this.ligthingSpell = this.game.add.audio('lighting_spell');
        this.shieldSpell = this.game.add.audio('shield_spell');
        this.selfExplosionSpell = this.game.add.audio('self_explosion');
        this.playerHit1 = this.game.add.audio('hit1');
        this.playerHit2 = this.game.add.audio('hit2');
        this.playerDie1 = this.game.add.audio('die');
        this.itemGet = this.game.add.audio('item_get');
        this.itemDrop = this.game.add.audio('item_drop');
        this.itemEquip = this.game.add.audio('item_equip');
        this.game.sound.setDecodedCallback([this.run], this.startSound, this);
        //creo la barra de sonido 
        this.createSoundBar();
    }
    cControlSounds.prototype.createSoundBar = function () {
        //dibujo del parlante
        var parlante = this.controlGame.game.add.sprite(850, 5, 'parlante');
        parlante.fixedToCamera = true;
        //dibujo de la barra inferior
        var barWidth = 100;
        var barHeight = 10;
        var bitmapVolumen = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapVolumen.ctx.beginPath();
        bitmapVolumen.ctx.rect(0, 0, barWidth, barHeight);
        bitmapVolumen.ctx.fillStyle = '#434444';
        bitmapVolumen.ctx.fill();
        this.volumeBar = this.controlGame.game.add.sprite(870, 8, bitmapVolumen);
        this.volumeBar.anchor.setTo(0);
        this.volumeBar.fixedToCamera = true;
        this.volumeBar.inputEnabled = true;
        this.volumeBar.events.onInputDown.add(this.changeVolume, this);
        var barWidth = 5;
        var barHeight = 15;
        var bitmapVolumen = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapVolumen.ctx.beginPath();
        bitmapVolumen.ctx.rect(0, 0, barWidth, barHeight);
        bitmapVolumen.ctx.fillStyle = '#050505';
        bitmapVolumen.ctx.fill();
        this.volumePiker = this.controlGame.game.add.sprite(970, 12, bitmapVolumen);
        this.volumePiker.anchor.setTo(0.5);
        this.volumePiker.fixedToCamera = true;
        this.volumePiker.inputEnabled = true;
    };
    cControlSounds.prototype.changeVolume = function () {
        var pos = this.controlGame.game.input.activePointer.position;
        this.volumePiker.cameraOffset.x = pos.x;
        this.masterVolume = Math.floor(pos.x - this.volumeBar.cameraOffset.x) / (this.volumeBar.width);
    };
    cControlSounds.prototype.startSound = function () {
        this.soundReady = true;
    };
    cControlSounds.prototype.startPlayerHit = function () {
        if (this.numberPlayerHit == 1) {
            //this.playerHit1.play(undefined, undefined, 0.5);
            this.numberPlayerHit = 2;
        }
        else {
            //this.playerHit2.play(undefined, undefined, 0.5);
            this.numberPlayerHit = 1;
        }
    };
    cControlSounds.prototype.startPlayerDie = function () {
        this.playerDie1.play(undefined, undefined, 0.5 * this.masterVolume);
    };
    cControlSounds.prototype.startItemEquip = function () {
        this.itemDrop.play(undefined, undefined, 0.5 * this.masterVolume);
    };
    cControlSounds.prototype.startSoundItemDrop = function () {
        this.itemEquip.play(undefined, undefined, 0.5 * this.masterVolume);
    };
    cControlSounds.prototype.startSoundItemGet = function () {
        this.itemGet.play(undefined, undefined, 0.3 * this.masterVolume);
    };
    cControlSounds.prototype.startSoundHit = function (spellType) {
        switch (spellType) {
            case 1 /* BasicAtack */:
                this.basicHit.play(undefined, undefined, 0.5 * this.masterVolume);
                break;
            case 2 /* CriticalBall */:
                this.basicHit.play(undefined, undefined, 0.5 * this.masterVolume);
                break;
            case 6 /* LightingStorm */:
                this.ligthingSpell.play(undefined, undefined, 0.2 * this.masterVolume);
                break;
            case 5 /* HealHand */:
                this.healSpell.play(undefined, undefined, 0.8 * this.masterVolume);
                break;
            case 4 /* ProtectField */:
                this.shieldSpell.play(undefined, undefined, 0.6 * this.masterVolume);
                break;
            case 7 /* SelfExplosion */:
                this.selfExplosionSpell.play(undefined, undefined, 0.6 * this.masterVolume);
                break;
            default:
                break;
        }
    };
    cControlSounds.prototype.startRun = function () {
        if (this.run.isPlaying == false) {
            this.run.loopFull(0.5 * this.masterVolume);
        }
    };
    cControlSounds.prototype.stopRun = function () {
        this.run.stop();
    };
    return cControlSounds;
}());
