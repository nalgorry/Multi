class cControlPortal {

    private arrayPortals:Array<cPortal>;

    constructor(public controlGame:cControlGame) {
        this.createPortals();
    }

    private createPortals() {

        this.arrayPortals = new Array<cPortal>();

        var portal = new cPortal(this.controlGame,1,50,4);
        this.arrayPortals['p'+1] = portal

    }

    //el servidor emite esto cuando entras al portal 
    public youEnterPortal(data) {
            console.log("ENTRO AL MEGA SUPER PORTAL");
        console.log(data.idPortal)

        switch (data.idPortal) {
            case 1:
                console.log("entra aca?")
                this.controlGame.controlPlayer.teleport(80,80);
                break;
        
            default:
                break;
        }

    }

    public checkPortals(tileX,tileY) {

        

       for (var idPortal in this.arrayPortals) {

           var portal:cPortal = this.arrayPortals[idPortal]; 

            if( (tileX == portal.tileX || tileX == portal.tileX +1) && tileY + 1 == portal.tileY ) {

                this.controlGame.controlServer.socket.emit('enter portal', {idPortal: portal.portalID})
                
            }
        }   

    }


}

class cPortal {


    constructor(public controlGame:cControlGame,public portalID:number, public tileX:number, public tileY:number) {

        var gridSize = this.controlGame.gridSize;
        var sprite = this.controlGame.game.add.sprite(tileX * gridSize,tileY * gridSize,'portal');

        sprite.anchor.y = 1;

        console.log(sprite.y)

        this.controlGame.depthGroup.add(sprite);      

    }

}