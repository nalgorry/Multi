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

    public actualFocusSystem:FocusSystem = FocusSystem.mana;

    textLife: Phaser.BitmapText;
    textMana: Phaser.BitmapText;
    textEnergy: Phaser.BitmapText;
    textAtack: Phaser.BitmapText;
    textDefence: Phaser.BitmapText;
    textPlayersOnline: Phaser.BitmapText;
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

    //estadisticas del jugador
    groupPlayerStats:Phaser.Group;
    
    //recuadro para seleccionar una de las barrasy el circulo
    public rectangleFocus:Phaser.Graphics;

    constructor(public controlGame:cControlGame) {
    
        var gameWidth:number = this.controlGame.game.width;
        var gameHeight:number = this.controlGame.game.height;


        //we add the element to the interface group to be able to manipulate it later
        this.controlGame.groupInterface.add(this.controlGame.spriteInterfaz);
        
        this.LoadBars();
        this.createBars(gameWidth,gameHeight);
        this.createPotions();
        this.createAtackDefence();

        this.createPlayerStats();

        //seteo por defecto el focus en mana
        this.SelectManaFocus();

        var timer = this.controlGame.game.time.events.loop(this.speedFocus, this.UpdateFocus, this);

    }

    private createPlayerStats() {
          //genero un circulo en la imagen del jugador 
        var backCircle = this.controlGame.game.add.graphics(0,0);
        backCircle.beginFill(0x000000);
        backCircle.drawCircle(0, 0, 80);

        var playerImageSprite = this.controlGame.game.add.sprite(1065, 50);
        playerImageSprite.addChild(backCircle);
        playerImageSprite.alpha = 0.5;
        playerImageSprite.fixedToCamera = true;
        playerImageSprite.inputEnabled = true;

        playerImageSprite.events.onInputOver.add(this.showPlayerStats,this);
        playerImageSprite.events.onInputOut.add(this.hidePlayerStats,this);


    }

    private showPlayerStats() {

        this.groupPlayerStats = new Phaser.Group(this.controlGame.game);

        //genero el fondo de las estadisticas
        var height = 610;
        var width = 200;
        var bitmapDescItem = this.controlGame.game.add.bitmapData(width, height);
        bitmapDescItem.ctx.beginPath();
        bitmapDescItem.ctx.rect(0, 0, width, height);
        bitmapDescItem.ctx.fillStyle = '#363636';
        bitmapDescItem.ctx.fill();
        
        var backGroundDesc = this.controlGame.game.add.sprite(790, 10, bitmapDescItem);
        backGroundDesc.anchor.setTo(0);
        backGroundDesc.fixedToCamera = true;
        backGroundDesc.alpha = 0.9;

        this.groupPlayerStats.add(backGroundDesc);

        var colWidth = 40;
        var colHeight = 25;
        var textStart = 68;
        var textWidth = 30;
        var heightStart = 150;
        var styleText = { font: "14px Arial", fill: "#ffffff", boundsAlignH: "center", fontWeight: 600};;

        //agrego ataque y defenza
        var atackDefense = this.controlGame.game.add.sprite(5, 20, "atackDefense");
        backGroundDesc.addChild(atackDefense);

        var textValue = this.controlGame.game.add.bitmapText(105, 27, 'arial', this.maxAtack.toString() , 16);
        //var value = this.controlGame.game.add.text(105, 27, this.maxAtack.toString() , styleText);
        backGroundDesc.addChild(textValue);
        var value = this.controlGame.game.add.text(165, 27, this.maxDefence.toString() , styleText);
        backGroundDesc.addChild(value);

        //agrego las posiciones y las estadisticas basicas
        //vida 
        var label = this.controlGame.game.add.sprite(textStart - 4 , heightStart - 40, 'items', 35);
        backGroundDesc.addChild(label);

        //mana
        var label = this.controlGame.game.add.sprite(textStart - 4 + colWidth, heightStart - 40, 'items', 33);        
        backGroundDesc.addChild(label);

        //energia
        var label = this.controlGame.game.add.sprite(textStart - 4 + colWidth * 2, heightStart - 40, 'items', 31);
        backGroundDesc.addChild(label);

        //label de las propiedades

        //voy a sacar las propiedades de los items de aca 
        var value = this.controlGame.game.add.text(textStart, heightStart, this.maxLife.toString() , styleText);
        value.setTextBounds(0, 0, textWidth, 0);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth, heightStart, this.maxMana.toString() , styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth * 2, heightStart, this.maxEnergy.toString() , styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);


        var value = this.controlGame.game.add.text(textStart, heightStart + colHeight, this.getItemValue(enumItemEfects.speedLife) + "%" , styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth, heightStart + colHeight, this.getItemValue(enumItemEfects.speedMana) + "%" , styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth * 2, heightStart + colHeight, this.getItemValue(enumItemEfects.speedEnergy) + "%" , styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
         
    }

    private getItemValue(enumItemProp:enumItemEfects):string {

        var arrayitemProp = this.controlGame.controlPlayer.controlItems.arrayItemEfects;
        var itemProp = arrayitemProp[enumItemProp];

        var itemvalue:string;
        if (itemProp != undefined ) { 
            itemvalue = itemProp.value.toString(); 
        } else {
            itemvalue = '0';
        }; 
        
        return itemvalue;
    }

    private hidePlayerStats() {
        this.groupPlayerStats.destroy();
    }
    



    public createPotions() {
        var spriteHeal = this.controlGame.game.add.sprite(0, 114, 'items', 35);
        this.controlGame.spriteInterfaz.addChild(spriteHeal);
        spriteHeal.inputEnabled = true;
        spriteHeal.events.onInputDown.add(this.SelectLifeFocus, this);

        var spriteMana = this.controlGame.game.add.sprite(0, 114 + 25, 'items', 33);
        this.controlGame.spriteInterfaz.addChild(spriteMana);
        spriteMana.inputEnabled = true;
        spriteMana.events.onInputDown.add(this.SelectManaFocus, this);

        var spriteEnergy = this.controlGame.game.add.sprite(0, 114 + 25 * 2,'items', 31);
        this.controlGame.spriteInterfaz.addChild(spriteEnergy);
        spriteEnergy.inputEnabled = true;
        spriteEnergy.events.onInputDown.add(this.SelectEnergyFocus, this);

    }

    public SpellPosible(spell:cSpell):boolean {

        if (this.mana >= spell.manaCost) {
            if (this.energy >= spell.energyCost) {
                if (this.life >= spell.lifeCost) {

                    this.UpdateEnergy(-spell.energyCost);
                    this.UpdateMana(-spell.manaCost);
                    this.UpdateLife(-spell.lifeCost);
                    return true;
                } else {
                    this.controlGame.controlPlayer.showMessage("NEED LIFE");
                    return false;
                }
            } else {
                this.controlGame.controlPlayer.showMessage("NEED ENERGY");
                return false;
            }
        } else {
            this.controlGame.controlPlayer.showMessage("NEED MANA");
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
                this.rectangleFocus.x = this.lifeBar.x;
                this.rectangleFocus.y = this.lifeBar.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.life; 
                break;
            case FocusSystem.mana :

                this.actualFocusMana = this.speedFocusMana;
                this.rectangleFocus.x = this.manaBar.x;
                this.rectangleFocus.y = this.manaBar.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.mana;
                break;
            case FocusSystem.energy:

                this.actualFocusEnergy = this.speedFocusEnergy;
                this.rectangleFocus.x = this.energyBar.x;
                this.rectangleFocus.y = this.energyBar.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.energy;
                break;
            case FocusSystem.nothing:
                
                this.rectangleFocus.visible = false;
                this.actualFocusSystem = FocusSystem.nothing;
                
                break;
        }  

    }

    private LoadBars() {
        //esto tendria que venir del server en algun momento
        this.maxLife = 180;
        this.maxEnergy = 100;
        this.maxMana = 100;

        this.baseMaxLife = 180;
        this.baseMaxEnergy = 100;
        this.baseMaxMana = 100;
        
        this.life = 180;
        this.energy = 50;
        this.mana = 50;

        this.baseMaxAtack = 2;
        this.baseMaxDefence = 2;

        this.maxAtack = 2;
        this.maxDefence = 2;    

    }

    public createAtackDefence() {
        
        this.textAtack = this.controlGame.game.add.bitmapText(160, 48, 'gotic_white', this.maxAtack.toString() , 16)
        this.controlGame.spriteInterfaz.addChild(this.textAtack);

        this.textDefence = this.controlGame.game.add.bitmapText(160, 71, 'gotic_white', this.maxDefence.toString() , 16)
        this.controlGame.spriteInterfaz.addChild(this.textDefence);

        this.textPlayersOnline = this.controlGame.game.add.bitmapText(160, 93, 'gotic_white', "1" , 16)
        this.controlGame.spriteInterfaz.addChild(this.textPlayersOnline);
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
        this.lifeBar = this.controlGame.game.add.sprite(33, 125 + bitmapVida.height,bitmapVida);
        this.lifeBar.anchor.setTo(1);
        this.controlGame.spriteInterfaz.addChild(this.lifeBar);
        this.lifeBar.inputEnabled = true;
        this.lifeBar.events.onInputDown.add(this.SelectLifeFocus, this);
        
        //mana
        var bitmapMana = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapMana.ctx.beginPath();
        bitmapMana.ctx.rect(0, 0, barWidth, barHeight);
        bitmapMana.ctx.fillStyle = '#0099ff';
        bitmapMana.ctx.fill();
        this.manaBar = this.controlGame.game.add.sprite(33 , 125 + 25 + bitmapMana.height,bitmapMana);
        this.manaBar.anchor.setTo(1);
        this.controlGame.spriteInterfaz.addChild(this.manaBar);
        this.manaBar.inputEnabled = true;
        this.manaBar.events.onInputDown.add(this.SelectManaFocus, this);

        //energia
        var bitmapEnergia = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, barWidth, barHeight);
        bitmapEnergia.ctx.fillStyle = '#33cc66';
        bitmapEnergia.ctx.fill();
        this.energyBar = this.controlGame.game.add.sprite(33, 125 + 25 * 2 + bitmapEnergia.height,bitmapEnergia);
        this.energyBar.anchor.setTo(1);
        this.controlGame.spriteInterfaz.addChild(this.energyBar);
        this.energyBar.inputEnabled = true;
        this.energyBar.events.onInputDown.add(this.SelectEnergyFocus, this);

        //hago las barras del tamaño segun los valores actuales
        this.ResizeBar(this.lifeBar,this.life,this.maxLife);
        this.ResizeBar(this.manaBar,this.mana,this.maxMana);
        this.ResizeBar(this.energyBar,this.energy,this.maxEnergy);

        //para los textos de las barras
        this.styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600};
        this.textLife = this.controlGame.game.add.bitmapText(35, 125, 'gotic_white', "200" , 16);
        this.controlGame.spriteInterfaz.addChild(this.textLife);

        this.textMana = this.controlGame.game.add.bitmapText(35, 125 + 25, 'gotic_white', "200" , 16);
        this.controlGame.spriteInterfaz.addChild(this.textMana);

        this.textEnergy = this.controlGame.game.add.bitmapText(35, 125 + 25 * 2, 'gotic_white', "200" , 16);
        this.controlGame.spriteInterfaz.addChild(this.textEnergy);

        //  Para hacer un recuadro sobre la barra selecionada
        this.rectangleFocus = this.controlGame.game.add.graphics(0,0);
        this.rectangleFocus.lineStyle(2, 0xffffff, 1);
        this.controlGame.spriteInterfaz.addChild(this.rectangleFocus);
        this.rectangleFocus.drawRect(0, -barHeight,barWidth, barHeight);

    }

}