class cControlPortal {

    private arrayPortals:Array<cPortal>;

    constructor(public controlGame:cControlGame) {
        this.createPortals();
    }

    private createPortals() {

        this.arrayPortals = new Array<cPortal>();

        var portal = new cPortal(this.controlGame, enumMapNames.fistMap, 45, 62);
        this.arrayPortals['p'+1] = portal

    }

    //el servidor emite esto cuando entras al portal 
    public youEnterPortal(data) {

        this.controlGame.changeMap(data);

    }

    public checkPortals(tileX,tileY) {

       for (var idPortal in this.arrayPortals) {

           var portal:cPortal = this.arrayPortals[idPortal]; 

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
        }   

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