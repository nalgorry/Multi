class cControlPortal {

    private arrayPortals:Array<cPortal>;

    constructor(public controlGame:cControlGame) {
        this.createPortals();
    }

    private createPortals() {

        this.arrayPortals = new Array<cPortal>();

        var portal = new cPortal(this.controlGame,1,50,4);
        this.arrayPortals.push(portal)

    }

    public checkPortals(tileX,tileY) {

       for (let portal of this.arrayPortals) { 
            if( (tileX == portal.tileX || tileX == portal.tileX +1) && tileY + 1 == portal.tileY ) {

                console.log("ENTRO AL MEGA SUPER PORTAL");
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