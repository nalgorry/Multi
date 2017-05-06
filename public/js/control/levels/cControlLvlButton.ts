class cControlLvlButton {

    public itemEfect:enumItemEfects;
    public value:number;
    public sprite:Phaser.Sprite; //aca voy a poner el grafico del boton 

    public statSelect:Phaser.Signal;

    public constructor(public controlGame:cControlGame,x:number, y:number, text:string, value:number, itemEfect:enumItemEfects) {
        this.createLvlBoton(x,y,text,value, itemEfect);

        this.statSelect = new Phaser.Signal();
    }

     private createLvlBoton(x:number, y:number, text:string, value:number, itemEfect:enumItemEfects) {

        this.sprite = this.controlGame.game.add.sprite(x,y)
        this.sprite.fixedToCamera = true;
        
        var textOption = this.controlGame.game.add.bitmapText(0, 0,  'gotic_white', text, 16);
        textOption.anchor.set(0.5);

        //normal state button 
        var bitmapBoton = this.controlGame.game.add.graphics(-24, -8);
        bitmapBoton.beginFill(0x363636);
        bitmapBoton.lineStyle(2, 0x000000, 1);
        bitmapBoton.drawRect(-(textOption.width)/2, -38/2/2, textOption.width + 48, 38);
        bitmapBoton.endFill();
        bitmapBoton.alpha = 0.9;

        //onmouseover state button 
        var bitmapBotonOver = this.controlGame.game.add.graphics(-24, -8);
        bitmapBotonOver.beginFill(0x363636);
        bitmapBotonOver.lineStyle(2, 0xFFFFFF, 1);
        bitmapBotonOver.drawRect(-(textOption.width)/2, -38/2/2, textOption.width + 48, 38);
        bitmapBotonOver.endFill();
        bitmapBotonOver.alpha = 0.9;
        bitmapBotonOver.visible = false;
        

        //var backGround = this.controlGame.game.add.sprite(-24, -8, bitmapBoton);
        //backGround.alpha = 0.9;

        this.sprite.addChild(bitmapBoton);
        this.sprite.addChild(bitmapBotonOver);
        this.sprite.addChild(textOption);
        this.value = value; //save the property of the item here
        this.itemEfect = itemEfect;

        this.sprite.inputEnabled = true;

        this.sprite.events.onInputOver.add(this.botonLvlUpOver,this);
        this.sprite.events.onInputOut.add(this.botonLvlUpOut,this);
        this.sprite.events.onInputDown.add(this.botonLvlUpDown,this);
        
    }

    public botonLvlUpDown (btton:Phaser.Sprite) {

        this.statSelect.dispatch(this);
    }

    public botonLvlUpOver(button:Phaser.Sprite) {
        button.children[0].visible = false;
        button.children[1].visible = true;

    }

    public botonLvlUpOut(button:Phaser.Sprite) {
        button.children[0].visible = true;
        button.children[1].visible = false;

    }


}