class cBasicActor {

    public tileX: number;
    public tileY: number;
    public playerSprite: Phaser.Sprite;
    public controlGame:cControlGame
    
    textChat: Phaser.Text;
    styleChat;
    styleHit;

    constructor(_controlGame:cControlGame) {
        
        this.controlGame = _controlGame;
        this.styleChat = { font: "16px Arial", fill: "#000000" };
        this.styleHit = { font: "22px Arial", fill: "#612131" };

    }

    public setChatText(texto:string) {

        if (this.textChat == null) {
            this.textChat = this.controlGame.game.add.text(-30, -this.playerSprite.height, "" , this.styleChat);
            this.playerSprite.addChild(this.textChat);
        }

        this.textChat.text = texto;

    }

    public onHit(data) {
        
        //texto con el daño
        var hitText = this.controlGame.game.add.text(-30, -40, data.damage , this.styleHit);
        this.playerSprite.addChild(hitText);

        var tweenText = this.controlGame.game.add.tween(hitText).to({y: '-30'},500,undefined,true);
        tweenText.onComplete.add(this.removeTweenText,hitText);
    }

    removeTweenText(sprite:Phaser.Sprite) {        
        sprite.destroy();        
    }
    
}