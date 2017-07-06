class cControlSounds {

    private run:Phaser.Sound;
    private basicHit:Phaser.Sound;
    private arrow:Phaser.Sound;
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

    private volumePiker:Phaser.Sprite;
    private volumeBar:Phaser.Sprite;

    private masterVolume:number = 0.5;

    private game:Phaser.Game
    private soundReady:boolean = false;


    constructor(public controlGame:cControlGame) {

        this.game = controlGame.game;

        //cargo los sonidos
        this.run = this.game.add.audio('run');
        this.basicHit = this.game.add.audio('basic_hit');
        this.arrow = this.game.add.audio('arrow_sound');
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

    createSoundBar() {

        
        //dibujo del parlante
        var parlante = this.controlGame.game.add.sprite(850,5,'parlante');
        parlante.fixedToCamera = true;

        //dibujo de la barra inferior
        var barPrincipalWidth:number = 100;
        var barPrincipalHeight:number = 10;

        var bitmapVolumen = this.controlGame.game.add.bitmapData(barPrincipalWidth, barPrincipalHeight);
        bitmapVolumen.ctx.beginPath();
        bitmapVolumen.ctx.rect(0, 0, barPrincipalWidth, barPrincipalHeight);
        bitmapVolumen.ctx.fillStyle = '#434444';
        bitmapVolumen.ctx.fill();
        this.volumeBar = this.controlGame.game.add.sprite(870 , 8  , bitmapVolumen);
        this.volumeBar.anchor.setTo(0);
        this.volumeBar.fixedToCamera = true;
        this.volumeBar.inputEnabled = true;
        this.volumeBar.events.onInputDown.add(this.changeVolume, this);

        var barWidth:number = 5;
        var barHeight:number = 15;

        var bitmapVolumen = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapVolumen.ctx.beginPath();
        bitmapVolumen.ctx.rect(0, 0, barWidth, barHeight);
        bitmapVolumen.ctx.fillStyle = '#050505';
        bitmapVolumen.ctx.fill();
        this.volumePiker = this.controlGame.game.add.sprite(970 - barPrincipalWidth/2 , 12, bitmapVolumen);
        this.volumePiker.anchor.setTo(0.5);
        this.volumePiker.fixedToCamera = true;
        this.volumePiker.inputEnabled = true;

        //we add the element to the interface group to be able to manipulate it later
        this.controlGame.groupInterface.add(parlante);
        this.controlGame.groupInterface.add(this.volumeBar);
        this.controlGame.groupInterface.add(this.volumePiker);

    }

    changeVolume() {

        var pos = this.controlGame.game.input.activePointer.position;
        this.volumePiker.cameraOffset.x = pos.x;

        this.masterVolume = Math.floor(pos.x - this.volumeBar.cameraOffset.x) / (this.volumeBar.width);
    }

    startSound() {
        this.soundReady = true;
    }

    public startPlayerHit() {

        if (this.numberPlayerHit == 1) {
            this.playerHit1.play(undefined, undefined, 0.2 * this.masterVolume );
            this.numberPlayerHit = 2;
        } else {
            this.playerHit2.play(undefined, undefined, 0.2 * this.masterVolume);
            this.numberPlayerHit = 1;
        }

    }

    public startPlayerDie() {
        this.playerDie1.play(undefined, undefined, 0.3 * this.masterVolume);
    }

    public startItemEquip() {
         this.itemDrop.play(undefined, undefined, 0.5 * this.masterVolume);
    }

    public startSoundItemDrop() {
        this.itemEquip.play(undefined, undefined, 0.5 * this.masterVolume);
    }


    public startSoundItemGet() {
        this.itemGet.play(undefined, undefined, 0.3 * this.masterVolume);
    }

    public startSoundHit(spellType:enumSpells) {


        switch (spellType) {
            case enumSpells.BasicAtack:
                this.arrow.play(undefined, undefined, 0.25 * this.masterVolume);
                break;
            case enumSpells.CriticalBall:
                this.basicHit.play(undefined, undefined, 0.35 * this.masterVolume);
                break;
            case enumSpells.LightingStorm:
                this.ligthingSpell.play(undefined, undefined, 0.2 * this.masterVolume);
                break;
            case enumSpells.HealHand:
                this.healSpell.play(undefined, undefined, 0.8 * this.masterVolume);
                break;
            case enumSpells.ProtectField:
                this.shieldSpell.play(undefined, undefined, 0.6 * this.masterVolume);
                break;
            case enumSpells.fireballHit:
                this.selfExplosionSpell.play(undefined, undefined, 0.2 * this.masterVolume);
                break;
            case enumSpells.fireballRelease:
                this.healSpell.play(undefined, undefined, 0.6 * this.masterVolume);
                break;
            default:
                break;
        }

        
    }

    public startRun() {
        if (this.run.isPlaying == false) { 
            this.run.loopFull(0.5 * this.masterVolume);
        }
    }

    public stopRun() {
        this.run.stop();
    }



}