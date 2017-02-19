class cControlSounds {

    private run:Phaser.Sound;
    private basicHit:Phaser.Sound;
    private healSpell:Phaser.Sound;
    private ligthingSpell:Phaser.Sound;
    private shieldSpell:Phaser.Sound;
    private selfExplosionSpell:Phaser.Sound;
    private itemGet:Phaser.Sound;
    private itemDrop:Phaser.Sound;
    private itemEquip:Phaser.Sound;
    private playerHit1:Phaser.Sound;
    private playerHit2:Phaser.Sound;
    private playerDie1:Phaser.Sound;
    private numberPlayerHit:number = 1;


    private game:Phaser.Game
    private soundReady:boolean = false;


    constructor(public cControlGame:cControlGame) {

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

    startSound() {
        this.soundReady = true;
    }

    public startPlayerHit() {

        if (this.numberPlayerHit == 1) {
            this.playerHit1.play(undefined, undefined, 0.5);
            this.numberPlayerHit = 2;
        } else {
            this.playerHit2.play(undefined, undefined, 0.5);
            this.numberPlayerHit = 1;
        }

    }

    public startPlayerDie() {
        this.playerDie1.play(undefined, undefined, 0.5);
    }

    public startItemEquip() {
         this.itemDrop.play(undefined, undefined, 0.5);
    }

    public startSoundItemDrop() {
        this.itemEquip.play(undefined, undefined, 0.5);
    }


    public startSoundItemGet() {
        this.itemGet.play(undefined, undefined, 0.3);
    }

    public startSoundHit(spellType:enumSpells) {


        switch (spellType) {
            case enumSpells.BasicAtack:
                this.basicHit.play(undefined, undefined, 0.5);
                break;
            case enumSpells.CriticalBall:
                this.basicHit.play(undefined, undefined, 0.5);
                break;
            case enumSpells.LightingStorm:
                this.ligthingSpell.play(undefined, undefined, 0.8);
                break;
            case enumSpells.HealHand:
                this.healSpell.play(undefined, undefined, 0.8);
                break;
            case enumSpells.ProtectField:
                this.shieldSpell.play(undefined, undefined, 0.6);
                break;
            case enumSpells.SelfExplosion:
                this.selfExplosionSpell.play(undefined, undefined, 0.6);
                break;
            default:
                break;
        }

        
    }

    public startRun() {
        if (this.run.isPlaying == false) { 
            this.run.loopFull(0.5);
        }
    }

    public stopRun() {
        this.run.stop();
    }



}