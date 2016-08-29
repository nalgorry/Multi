enum FocusSystem {
    nothing = 0, 
    life = 1,
    mana = 2,
    energy = 3,
    exp = 4
    }

class cControlFocus {

    //constantes para velocidad del focus
    speedFocus:number = 50;

    speedNormalLife:number = 0.1;
    speedNormalMana:number = 0.25;
    speedNormalEnergy:number = 0.5;

    speedFocusLife:number = this.speedNormalLife * 8;
    speedFocusMana:number = this.speedNormalMana * 8;
    speedFocusEnergy:number = this.speedNormalEnergy * 8;

    actualFocusSystem:FocusSystem = FocusSystem.nothing;

    textLife: Phaser.Text;
    textMana: Phaser.Text;
    textEnergy: Phaser.Text;
    styleText;

    //valores actuales utilizados por el focus sistem
    actualFocusLife:number = this.speedNormalLife;
    actualFocusMana:number = this.speedNormalMana;
    actualFocusEnergy:number = this.speedNormalEnergy;
    
    //estadisticas maximas del jugador
    maxLife: number;
    maxMana: number;
    maxEnergy: number;
    
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

    //recuadro para seleccionar una de las barras
    public rectangleFocus:Phaser.Graphics;
    

    constructor(public controlGame:cControlGame) {
    
        this.LoadBars();
        this.CreateBars();

        var timer = this.controlGame.game.time.events.loop(this.speedFocus, this.UpdateFocus, this);
        
        //para los textos de las barras
        this.styleText = { font: "15px Arial", fill: "#ffffff", textalign: "center"};
        this.textLife = this.controlGame.game.add.text(850, 105, "200" , this.styleText);
        this.textLife.fixedToCamera = true;

        this.textMana = this.controlGame.game.add.text(894, 105, "200" , this.styleText);
        this.textMana.fixedToCamera = true;

        this.textEnergy = this.controlGame.game.add.text(936, 105, "200" , this.styleText);
        this.textEnergy.fixedToCamera = true;

    }

    public SpellPosible(needMana:number,needEnergy:number,needLife:number):boolean {

        if (this.mana >= needMana && this.energy >= needEnergy && this.life >= needLife) {
            
            this.UpdateEnergy(-50);
            this.UpdateMana(-50);
            
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
             { y: value / maxValue }, 25, Phaser.Easing.Linear.None, true);
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
            //si paso el maximo con alguna de las barras, me fijo si es necesario resetear el sistema de focus
            if (this.actualFocusSystem == FocusSystem.life || this.actualFocusSystem == FocusSystem.mana || this.actualFocusSystem == FocusSystem.energy) {
                this.SelectNothingFocus();
            }

        }

        this.ResizeBar(bar,value,maxValue);

        return value;
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

    private SelectFocus(wichFocus:FocusSystem) {
        
        switch (wichFocus) {
            case FocusSystem.life:

                this.actualFocusLife = this.speedFocusLife;
                this.actualFocusMana = 0;
                this.actualFocusEnergy = 0;
                this.rectangleFocus.cameraOffset.x = 850;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.life; 
                break;
            case FocusSystem.mana :

                this.actualFocusLife = 0;
                this.actualFocusMana = this.speedFocusMana;
                this.actualFocusEnergy = 0;
                this.rectangleFocus.cameraOffset.x = 894;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.mana;
                break;
            case FocusSystem.energy:

                this.actualFocusLife = 0;
                this.actualFocusMana = 0;
                this.actualFocusEnergy = this.speedFocusEnergy;
                this.rectangleFocus.cameraOffset.x = 937;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.energy;
                break;
            case FocusSystem.nothing:
                
                this.actualFocusLife = this.speedNormalLife;
                this.actualFocusMana = this.speedNormalMana;
                this.actualFocusEnergy = this.speedNormalEnergy;
                this.rectangleFocus.visible = false;
                this.actualFocusSystem = FocusSystem.nothing;

                break;
        }     
    }

    private LoadBars() {
        //esto tendria que venir del server en algun momento
        this.maxLife = 200;
        this.maxEnergy = 200;
        this.maxMana = 200;
        
        this.life = 100;
        this.energy = 100;
        this.mana = 100;

    }

    private CreateBars() {

        //creo las barras de vida y energia 
      
        //vida
        var bitmapVida = this.controlGame.game.add.bitmapData(24, 130);
        bitmapVida.ctx.beginPath();
        bitmapVida.ctx.rect(0, 0, 24, 130);
        bitmapVida.ctx.fillStyle = '#e33133';
        bitmapVida.ctx.fill();
        this.lifeBar = this.controlGame.game.add.sprite(850 + bitmapVida.width, 125 + bitmapVida.height,bitmapVida);
        this.lifeBar.anchor.setTo(1);
        this.lifeBar.fixedToCamera = true;

        //mana
        var bitmapMana = this.controlGame.game.add.bitmapData(24, 130);
        bitmapMana.ctx.beginPath();
        bitmapMana.ctx.rect(0, 0, 24, 130);
        bitmapMana.ctx.fillStyle = '#0099ff';
        bitmapMana.ctx.fill();
        this.manaBar = this.controlGame.game.add.sprite(894 + bitmapMana.width, 125 + bitmapMana.height,bitmapMana);
        this.manaBar.anchor.setTo(1);
        this.manaBar.fixedToCamera = true;

        //energia
        var bitmapEnergia = this.controlGame.game.add.bitmapData(25, 130);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, 24, 130);
        bitmapEnergia.ctx.fillStyle = '#33cc66';
        bitmapEnergia.ctx.fill();
        this.energyBar = this.controlGame.game.add.sprite(937 + bitmapEnergia.width, 125 + bitmapEnergia.height,bitmapEnergia);
        this.energyBar.anchor.setTo(1);
        this.energyBar.fixedToCamera = true;

         //exp
        var bitmapExp = this.controlGame.game.add.bitmapData(25, 130);
        bitmapExp.ctx.beginPath();
        bitmapExp.ctx.rect(0, 0, 24, 130);
        bitmapExp.ctx.fillStyle = '#cc33cc';
        bitmapExp.ctx.fill();
        this.expBar = this.controlGame.game.add.sprite(994 + bitmapExp.width,125 + bitmapExp.height,bitmapExp);
        this.expBar.anchor.setTo(1);
        this.expBar.fixedToCamera = true;

        //hago las barras del tamaño segun los valores actuales
        this.ResizeBar(this.lifeBar,this.life,this.maxLife);
        this.ResizeBar(this.manaBar,this.mana,this.maxMana);
        this.ResizeBar(this.energyBar,this.energy,this.maxEnergy);

        //  Para hacer un recuadro sobre la barra selecionada
        this.rectangleFocus = this.controlGame.game.add.graphics(0,0);
        this.rectangleFocus.lineStyle(2, 0xffffff, 1);
        this.rectangleFocus.fixedToCamera = true;
        this.rectangleFocus.drawRect(0, 0, 24, 130);
        

        this.rectangleFocus.cameraOffset.x = this.lifeBar.x - this.lifeBar.width;
        this.rectangleFocus.cameraOffset.y = 125;
        
        this.rectangleFocus.visible = false;

    }

}