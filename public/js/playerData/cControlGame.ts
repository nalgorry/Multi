class cControlGame {
    
    public game: Phaser.Game;
    public gridSize: number;
    public map: Phaser.Tilemap;
    public land: Phaser.TileSprite;
    public layer: Phaser.TilemapLayer;
    public cursors: Phaser.CursorKeys;

    constructor(_game:Phaser.Game) {
        this.game = _game;
    }
    

}