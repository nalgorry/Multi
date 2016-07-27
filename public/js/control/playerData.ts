class cPlayerData {

    public tileX: number;
    public tileY: number;
    public playerSprite: Phaser.Sprite;
    public controlGame:cControlGame
    
    textChat: Phaser.Text;
    styleChat;

    constructor(_controlGame:cControlGame) {
        
        this.controlGame = _controlGame;
        this.styleChat = { font: "22px Arial", fill: "#ffffff" };

    }

    public setChatText(texto:string) {

        if (this.textChat == null) {
            this.textChat = this.controlGame.game.add.text(-30, -30, "" , this.styleChat);
            this.playerSprite.addChild(this.textChat);
        }

        this.textChat.text = texto;

    }

    
}