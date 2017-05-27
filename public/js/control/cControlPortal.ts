class cControlPortal {

    private arrayPortals:Array<cPortal> = [];

    constructor(public controlGame:cControlGame) {
    }

    public resetPortals() {
        this.arrayPortals = new Array();
    }

    //this is get from the server
    public youEnterPortal(data) {
        this.controlGame.changeMap(data);
    }

    //this is get from the server 
    public newPortals(data) {
        
        data.forEach(portalData => {
            var portal = new cPortal(this.controlGame, portalData.idPortal, portalData.x, portalData.y);
            this.arrayPortals.push(portal);
        })
    }

    public checkPortals(tileX,tileY) {

        this.arrayPortals.forEach(portal =>{

            if( (tileX == portal.tileX || tileX == portal.tileX ) && tileY  == portal.tileY ) {

                console.log("entro a un portal")
                this.controlGame.controlServer.socket.emit('enter portal', 
                    {
                        idPortal: portal.portalID, 
                        name: 'Nuevo nombre', 
                        x: 50, 
                        y: 50
                    });
                this.controlGame.resetMap();
            }
        });

    }


}

class cPortal {

    constructor(public controlGame:cControlGame,public portalID:number, public tileX:number, public tileY:number) {

        var gridSize = this.controlGame.gridSize;
        var sprite = this.controlGame.game.add.sprite(tileX * gridSize,tileY * gridSize,'portal');

        sprite.anchor.y = 1;

        this.controlGame.depthGroup.add(sprite);      

    }

}