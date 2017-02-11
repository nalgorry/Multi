class cControlSounds {

    private run:Phaser.Sound;
    private basicHit:Phaser.Sound;
    private healSpell:Phaser.Sound;
    private game:Phaser.Game
    private soundReady:boolean = false;


    constructor(public cControlGame:cControlGame) {

        this.game = cControlGame.game;

        //cargo los sonidos
        this.run = this.game.add.audio('run');
        this.basicHit = this.game.add.audio('basic_hit');
        this.healSpell = this.game.add.audio('heal_spell');

        this.game.sound.setDecodedCallback([this.run], this.startSound, this);

    }

    startSound() {
        this.soundReady = true;
    }

    public startSoundHealSpell(spellType:enumSpells) {
        this.healSpell.play(undefined, undefined, 0.4);
    }

    public startSoundHit(spellType:enumSpells) {
        this.basicHit.play(undefined, undefined, 0.4);
    }

    public startRun() {
        if (this.run.isPlaying == false) { 
            this.run.loopFull();
        }
    }

    public stopRun() {
        this.run.stop();
    }



}