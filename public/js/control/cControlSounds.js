var cControlSounds = (function () {
    function cControlSounds(cControlGame) {
        this.cControlGame = cControlGame;
        this.soundReady = false;
        this.game = cControlGame.game;
        //cargo los sonidos
        this.run = this.game.add.audio('run');
        this.basicHit = this.game.add.audio('basic_hit');
        this.healSpell = this.game.add.audio('heal_spell');
        this.game.sound.setDecodedCallback([this.run], this.startSound, this);
    }
    cControlSounds.prototype.startSound = function () {
        this.soundReady = true;
    };
    cControlSounds.prototype.startSoundHealSpell = function (spellType) {
        this.healSpell.play(undefined, undefined, 0.4);
    };
    cControlSounds.prototype.startSoundHit = function (spellType) {
        this.basicHit.play(undefined, undefined, 0.4);
    };
    cControlSounds.prototype.startRun = function () {
        if (this.run.isPlaying == false) {
            this.run.loopFull();
        }
    };
    cControlSounds.prototype.stopRun = function () {
        this.run.stop();
    };
    return cControlSounds;
}());
