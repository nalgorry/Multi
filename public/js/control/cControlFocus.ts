enum FocusSystem {
    life = 0,
    mana = 1,
    energy = 2,
    exp = 3,
    nothing = 4, 
    }

class cControlFocus {

    //constantes para velocidad del focus
    speedFocus:number = 50;

    baseSpeedNormalLife:number = 0.1;
    baseSpeedNormalMana:number = 0.25;
    baseSpeedNormalEnergy:number = 0.5;

    baseSpeedFocusLife:number = 0.8;
    baseSpeedFocusMana:number = 2;
    baseSpeedFocusEnergy:number = 4;

    speedNormalLife:number = 0.1;
    speedNormalMana:number = 0.25;
    speedNormalEnergy:number = 0.5;

    speedFocusLife:number = 0.8;
    speedFocusMana:number = 2;
    speedFocusEnergy:number = 4;

    public actualFocusSystem:FocusSystem = FocusSystem.nothing;

    textLife: Phaser.Text;
    textMana: Phaser.Text;
    textEnergy: Phaser.Text;
    textAtack: Phaser.Text;
    textDefence: Phaser.Text;
    styleText;

    //valores actuales utilizados por el focus sistem
    actualFocusLife:number = this.speedNormalLife;
    actualFocusMana:number = this.speedNormalMana;
    actualFocusEnergy:number = this.speedNormalEnergy;
    
    //estadisticas basicas del jugador sin items
    baseMaxLife:number;
    baseMaxMana: number;
    baseMaxEnergy: number;
    baseMaxAtack:number;
    baseMaxDefence:number;
    
    //estadisticas maximas del jugador
    maxLife: number;
    maxMana: number;
    maxEnergy: number;
    maxAtack:number;
    maxDefence:number;
    
    //valores actuales del jugador
    life:number;
    mana:number;
    energy: number;
    exp:number;
    
    //barras del jugador
    lifeBar:Phaser.Sprite;
    manaBar:Phaser.Sprite;
    energyBar:Phaser.Sprite;
    expBar:Phaser.Sprite;
    
    //recuadro para seleccionar una de las barrasy el circulo
    public rectangleFocus:Phaser.Graphics;
    
    constructor(public controlGame:cControlGame) {
    
        var gameWidth:number = this.controlGame.game.width;
        var gameHeight:number = this.controlGame.game.height;
        
        this.LoadBars();
        this.createBars(gameWidth,gameHeight);
        this.createPotions();
        this.createAtackDefence();

        var timer = this.controlGame.game.time.events.loop(this.speedFocus, this.UpdateFocus, this);

    }

    public createPotions() {
        var spriteHeal = this.controlGame.game.add.sprite(1000,114,'items',35);
        spriteHeal.fixedToCamera = true;
        spriteHeal.inputEnabled = true;
        spriteHeal.events.onInputDown.add(this.SelectLifeFocus, this);

        var spriteMana = this.controlGame.game.add.sprite(1000,114 + 25,'items',33);
        spriteMana.fixedToCamera = true;
        spriteMana.inputEnabled = true;
        spriteMana.events.onInputDown.add(this.SelectManaFocus, this);

        var spriteEnergy = this.controlGame.game.add.sprite(1000,114 + 25 * 2,'items',31);
        spriteEnergy.fixedToCamera = true;
        spriteEnergy.inputEnabled = true;
        spriteEnergy.events.onInputDown.add(this.SelectEnergyFocus, this);

    }

    public SpellPosible(spell:cSpell):boolean {

        if (this.mana >= spell.manaCost && this.energy >= spell.energyCost && this.life >= spell.lifeCost) {
            
            this.UpdateEnergy(-spell.energyCost);
            this.UpdateMana(-spell.manaCost);
            this.UpdateLife(-spell.lifeCost);
            
            return true;

        } else {
            return false;
        }
    }
    
    public ResetBars() {
        this.UpdateLife(1 - this.life);
        this.UpdateMana(1 - this.mana);
        this.UpdateEnergy(1 - this.energy);
    }

    public ResizeBar(bar: Phaser.Sprite,value:number,maxValue:number) {
        this.controlGame.game.add.tween(bar.scale).to(
             { x: -value / maxValue }, 25, Phaser.Easing.Linear.None, true);
    }

    public UpdateFocus() {
        
        this.UpdateLife(this.actualFocusLife);
        this.UpdateMana(this.actualFocusMana);
        this.UpdateEnergy(this.actualFocusEnergy);

        this.textLife.text = Math.round(this.life).toString();
        this.textMana.text = Math.round(this.mana).toString();
        this.textEnergy.text = Math.round(this.energy).toString();

    }

    //devuelve true si el personaje llego a cero vida
    public UpdateLife(addValue:number):boolean {
        //controlo si se murio o no 
        if (this.life > -addValue) {
            this.life = this.UpdateBar(this.lifeBar,this.life,this.maxLife,addValue);
            return false;
        } else {
            this.life = 0;
            return true;
        }

        
    }

    public UpdateMana(addValue:number) {
        this.mana = this.UpdateBar(this.manaBar,this.mana,this.maxMana,addValue);
    }

    public UpdateEnergy(addValue:number) {
        this.energy = this.UpdateBar(this.energyBar,this.energy,this.maxEnergy,addValue);
    }

    public UpdateBar(bar:Phaser.Sprite,value:number,maxValue:number,addValue:number) {

        //controlo si no se paso del maximo
        if (value + addValue <= maxValue) {
            value += addValue;
        } else {
            value = maxValue;
        }

        this.ResizeBar(bar,value,maxValue);

        return value;
    }

    public SelectFocusFromSpell(idSpell:number):boolean {

        var selectedFocus:FocusSystem;

        if (idSpell == 0) {
            selectedFocus = FocusSystem.life;
        } else if (idSpell == 1 ) {
            selectedFocus = FocusSystem.mana;
        } else if (idSpell == 2 ) {
            selectedFocus = FocusSystem.energy;
        }
        
        //si vuelve a tocar el sistema seleccionado le saco la selección
        if (selectedFocus != this.actualFocusSystem) {
            this.SelectFocus(selectedFocus);
            return true;
            
        } else {
            this.SelectFocus(FocusSystem.nothing);
            return false;
        }

    }
    
    
    public SelectLifeFocus() {
        this.SelectFocus(FocusSystem.life);
    }

    public SelectManaFocus() {
        this.SelectFocus(FocusSystem.mana);
    }

    public SelectEnergyFocus() {
        this.SelectFocus(FocusSystem.energy);
    }

    public SelectNothingFocus() {
        this.SelectFocus(FocusSystem.nothing);
    }

    public SelectRotativeFocus() {

        if (this.actualFocusSystem == FocusSystem.life) {
            this.SelectManaFocus();
        } else if (this.actualFocusSystem == FocusSystem.mana) {
            this.SelectEnergyFocus();
        } else if (this.actualFocusSystem == FocusSystem.energy || this.actualFocusSystem == FocusSystem.nothing) {
            this.SelectLifeFocus();
        } 

    }

    public SelectFocus(wichFocus:FocusSystem) {
        
        //seteo todo en normal, y hago el focus en el sel
        this.actualFocusLife = this.speedNormalLife;
        this.actualFocusMana = this.speedNormalMana;
        this.actualFocusEnergy = this.speedNormalEnergy;

        switch (wichFocus) {
            case FocusSystem.life:

                this.actualFocusLife = this.speedFocusLife;
                this.rectangleFocus.cameraOffset.x = this.lifeBar.cameraOffset.x;
                this.rectangleFocus.cameraOffset.y = this.lifeBar.cameraOffset.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.life; 
                break;
            case FocusSystem.mana :

                this.actualFocusMana = this.speedFocusMana;
                this.rectangleFocus.cameraOffset.x = this.manaBar.cameraOffset.x;
                this.rectangleFocus.cameraOffset.y = this.manaBar.cameraOffset.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.mana;
                break;
            case FocusSystem.energy:

                this.actualFocusEnergy = this.speedFocusEnergy;
                this.rectangleFocus.cameraOffset.x = this.energyBar.cameraOffset.x;
                this.rectangleFocus.cameraOffset.y = this.energyBar.cameraOffset.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.energy;
                break;
            case FocusSystem.nothing:
                
                this.rectangleFocus.visible = false;
                this.actualFocusSystem = FocusSystem.nothing;
                
                break;
        }  

        //selecciono el circulo de focus
        var spellFocus:cSpell = this.controlGame.controlPlayer.controlSpells.arrayselSpells[wichFocus];

    }

    private LoadBars() {
        //esto tendria que venir del server en algun momento
        this.maxLife = 150;
        this.maxEnergy = 100;
        this.maxMana = 100;

        this.baseMaxLife = 150;
        this.baseMaxEnergy = 100;
        this.baseMaxMana = 100;
        
        this.life = 80;
        this.energy = 50;
        this.mana = 50;

        this.baseMaxAtack = 2;
        this.baseMaxDefence = 2;

        this.maxAtack = 2;
        this.maxDefence = 2;    

    }

    public createAtackDefence() {
        this.textAtack = this.controlGame.game.add.text(1168, 50, this.maxAtack.toString() , this.styleText);
        this.textAtack.fixedToCamera = true;

        this.textDefence = this.controlGame.game.add.text(1168, 73, this.maxDefence.toString() , this.styleText);
        this.textDefence.fixedToCamera = true;
    }

    public updateAtackDefence() {
        
        this.textAtack.text = this.maxAtack.toString();
        this.textDefence.text = this.maxDefence.toString();

    }

    private createBars(gameWidth:number,gameHeight:number) {

        //creo las barras de vida y energia
        var barHeight:number = 20;
        var barWidth:number = 158;

        //vida
        var bitmapVida = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapVida.ctx.beginPath();
        bitmapVida.ctx.rect(0, 0, barWidth, barHeight);
        bitmapVida.ctx.fillStyle = '#e33133';
        bitmapVida.ctx.fill();
        this.lifeBar = this.controlGame.game.add.sprite(gameWidth - 167, 125 + bitmapVida.height,bitmapVida);
        this.lifeBar.anchor.setTo(1);
        this.lifeBar.fixedToCamera = true;
        this.lifeBar.inputEnabled = true;
        this.lifeBar.events.onInputDown.add(this.SelectLifeFocus, this);

        //mana
        var bitmapMana = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapMana.ctx.beginPath();
        bitmapMana.ctx.rect(0, 0, barWidth, barHeight);
        bitmapMana.ctx.fillStyle = '#0099ff';
        bitmapMana.ctx.fill();
        this.manaBar = this.controlGame.game.add.sprite(gameWidth - 167 , 125 + 25 + bitmapMana.height,bitmapMana);
        this.manaBar.anchor.setTo(1);
        this.manaBar.fixedToCamera = true;
        this.manaBar.inputEnabled = true;
        this.manaBar.events.onInputDown.add(this.SelectManaFocus, this);

        //energia
        var bitmapEnergia = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, barWidth, barHeight);
        bitmapEnergia.ctx.fillStyle = '#33cc66';
        bitmapEnergia.ctx.fill();
        this.energyBar = this.controlGame.game.add.sprite(gameWidth - 167, 125 + 25 * 2 + bitmapEnergia.height,bitmapEnergia);
        this.energyBar.anchor.setTo(1);
        this.energyBar.fixedToCamera = true;
        this.energyBar.inputEnabled = true;
        this.energyBar.events.onInputDown.add(this.SelectEnergyFocus, this);

        //hago las barras del tamaño segun los valores actuales
        this.ResizeBar(this.lifeBar,this.life,this.maxLife);
        this.ResizeBar(this.manaBar,this.mana,this.maxMana);
        this.ResizeBar(this.energyBar,this.energy,this.maxEnergy);

        //para los textos de las barras
        this.styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600};
        this.textLife = this.controlGame.game.add.text(gameWidth - 165, 125, "200" , this.styleText);
        this.textLife.fixedToCamera = true;

        this.textMana = this.controlGame.game.add.text(gameWidth - 165, 125 + 25, "200" , this.styleText);
        this.textMana.fixedToCamera = true;

        this.textEnergy = this.controlGame.game.add.text(gameWidth - 165, 125 + 25 * 2, "200" , this.styleText);
        this.textEnergy.fixedToCamera = true;

        //  Para hacer un recuadro sobre la barra selecionada
        this.rectangleFocus = this.controlGame.game.add.graphics(0,0);
        this.rectangleFocus.lineStyle(2, 0xffffff, 1);
        this.rectangleFocus.fixedToCamera = true;
        this.rectangleFocus.drawRect(0, -barHeight,barWidth, barHeight);
        
        this.rectangleFocus.cameraOffset.x = this.lifeBar.x - this.lifeBar.width;
        this.rectangleFocus.cameraOffset.y = 125;
        
        this.rectangleFocus.visible = false;


        //exp
        //var bitmapExp = this.controlGame.game.add.bitmapData(25, 130);
        //bitmapExp.ctx.beginPath();
        //bitmapExp.ctx.rect(0, 0, 24, 130);
        //bitmapExp.ctx.fillStyle = '#cc33cc';
        //bitmapExp.ctx.fill();
        //this.expBar = this.controlGame.game.add.sprite(994 + bitmapExp.width,125 + bitmapExp.height,bitmapExp);
        //this.expBar.anchor.setTo(1);
        //this.expBar.fixedToCamera = true;


    }

}