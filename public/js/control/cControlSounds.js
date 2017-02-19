var cControlSounds = (function () {
    function cControlSounds(cControlGame) {
        this.cControlGame = cControlGame;
        this.numberPlayerHit = 1;
        this.soundReady = false;
        this.game = cControlGame.game;
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
    }
    cControlSounds.prototype.startSound = function () {
        this.soundReady = true;
    };
    cControlSounds.prototype.startPlayerHit = function () {
        if (this.numberPlayerHit == 1) {
            this.playerHit1.play(undefined, undefined, 0.5);
            this.numberPlayerHit = 2;
        }
        else {
            this.playerHit2.play(undefined, undefined, 0.5);
            this.numberPlayerHit = 1;
        }
    };
    cControlSounds.prototype.startPlayerDie = function () {
        this.playerDie1.play(undefined, undefined, 0.5);
    };
    cControlSounds.prototype.startItemEquip = function () {
        this.itemDrop.play(undefined, undefined, 0.5);
    };
    cControlSounds.prototype.startSoundItemDrop = function () {
        this.itemEquip.play(undefined, undefined, 0.5);
    };
    cControlSounds.prototype.startSoundItemGet = function () {
        this.itemGet.play(undefined, undefined, 0.3);
    };
    cControlSounds.prototype.startSoundHit = function (spellType) {
        switch (spellType) {
            case 1 /* BasicAtack */:
                this.basicHit.play(undefined, undefined, 0.5);
                break;
            case 2 /* CriticalBall */:
                this.basicHit.play(undefined, undefined, 0.5);
                break;
            case 6 /* LightingStorm */:
                this.ligthingSpell.play(undefined, undefined, 0.8);
                break;
            case 5 /* HealHand */:
                this.healSpell.play(undefined, undefined, 0.8);
                break;
            case 4 /* ProtectField */:
                this.shieldSpell.play(undefined, undefined, 0.6);
                break;
            case 7 /* SelfExplosion */:
                this.selfExplosionSpell.play(undefined, undefined, 0.6);
                break;
            default:
                break;
        }
    };
    cControlSounds.prototype.startRun = function () {
        if (this.run.isPlaying == false) {
            this.run.loopFull(0.5);
        }
    };
    cControlSounds.prototype.stopRun = function () {
        this.run.stop();
    };
    return cControlSounds;
}());
