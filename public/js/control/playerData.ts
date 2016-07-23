class cPlayerData {

    public tileX: number;
    public tileY: number;
    public playerSprite: Phaser.Sprite;
    public controlGame:cControlGame

    constructor(_controlGame:cControlGame) {
        this.controlGame = _controlGame;

    }
}