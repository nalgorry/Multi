class cPlayerData {

    public tileX: number;
    public tileY: number;
    public playerSprite: Phaser.Sprite;
    public controlGame:cControlGame

    constructor(_controlGame:cControlGame) {
        this.controlGame = _controlGame;

    }

    public setChatText(texto:Phaser.Text) {
        //pruebas de texto
        this.playerSprite.addChild(texto);
    }

    
}