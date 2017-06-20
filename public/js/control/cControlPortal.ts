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
                portalData.mapName,
                portalData.pvspAllowed,
                portalData.active);

            this.arrayPortals.push(portal);
        })
    }

    public checkPortals(tileX,tileY) {

        this.arrayPortals.forEach(portal =>{

            if( (tileX == portal.tileX || tileX == portal.tileX ) && tileY  == portal.tileY && portal.active == true ) {

                this.controlGame.controlServer.socket.emit('enter portal', 
                    {
                        idPortal: portal.portalID, 
                        name: this.controlGame.controlPlayer.playerName, 
                        x: portal.newMapTileX, 
                        y: portal.newMapTileY
                    });
                this.controlGame.resetMap(portal.newMapTileX, portal.newMapTileY);
                this.controlGame.changeMap(portal.mapName, portal.portalID, portal.pvspAllowed);
                this.controlGame.controlMissions.loadMision(portal.portalID);
    


            }
        });

    }


}

class cPortal {

    constructor(public controlGame:cControlGame,public portalID:number, public tileX:number, public tileY:number,
        public newMapTileX:number, public newMapTileY:number, public mapName, public pvspAllowed:boolean, public active:boolean) {

        var gridSize = this.controlGame.gridSize;
        var sprite = this.controlGame.game.add.sprite(tileX * gridSize + gridSize/2, tileY * gridSize + gridSize/2 ,'portal');
        sprite.anchor.set(0.5);
        
        if (active == true) {
            sprite.animations.add('portalOn', [1,2,3,4], 8, true);
            sprite.animations.play('portalOn');
        } else {
            sprite.animations.add('portalOff', [0], 8, true);
            sprite.animations.play('portalOff');
        }

        this.controlGame.depthGroup.add(sprite);     

    }

}