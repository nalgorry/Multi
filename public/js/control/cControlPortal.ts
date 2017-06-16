class cControlPortal {

    private arrayPortals:Array<cPortal> = [];

    constructor(public controlGame:cControlGame) {
    }

    public resetPortals() {
        this.arrayPortals = new Array();
    }

    //this is get from the server
    public youEnterPortal(data) {
        
    }

    //this is get from the server 
    public newPortals(data) {
        
        data.forEach(portalData => {
            var portal = new cPortal(
                this.controlGame, 
                portalData.idPortal, 
                portalData.x, 
                portalData.y,
                portalData.newMapTileX,
                portalData.newMapTileY,
                portalData.mapName);

            this.arrayPortals.push(portal);
        })
    }

    public checkPortals(tileX,tileY) {

        this.arrayPortals.forEach(portal =>{

            if( (tileX == portal.tileX || tileX == portal.tileX ) && tileY  == portal.tileY ) {

                this.controlGame.controlServer.socket.emit('enter portal', 
                    {
                        idPortal: portal.portalID, 
                        name: this.controlGame.controlPlayer.textName.text, 
                        x: portal.newMapTileX, 
                        y: portal.newMapTileY
                    });
                this.controlGame.resetMap(portal.newMapTileX, portal.newMapTileY);
                this.controlGame.changeMap(portal.mapName, portal.portalID);

            }
        });

    }


}

class cPortal {

    constructor(public controlGame:cControlGame,public portalID:number, public tileX:number, public tileY:number,
        public newMapTileX:number, public newMapTileY:number, public mapName) {

        var gridSize = this.controlGame.gridSize;
        var sprite = this.controlGame.game.add.sprite(tileX * gridSize + gridSize/2, tileY * gridSize - gridSize/2 ,'portal');
        sprite.anchor.set(0.5);
        
        sprite.animations.add('portalOn', [1,2,3,4], 8, true);
        sprite.animations.play('portalOn');

        this.controlGame.depthGroup.add(sprite);     

    }

}