import {cServerPortals} from './cServerPortals';

export class cServerMap {

    public arrayPortals:cServerPortals[] = [];
    public id:number;
    public mapName:string; 
    public file:string; 
    public monsterNumber:number;

    constructor (JSONMapData) {

        this.id = JSONMapData.id; 
        this.mapName = JSONMapData.mapName; 
        this.file = JSONMapData.file;
        this.monsterNumber = JSONMapData.monsterNumber;

        //lets add the portals to the map
        if (JSONMapData.portals != undefined) {
            JSONMapData.portals.forEach (portal => {
                
                this.arrayPortals.push(new cServerPortals(
                    portal.idPortal, 
                    portal.x, 
                    portal.y,
                    portal.newMapTileX,
                    portal.newMapTileY
                    ))
            });
        }

    }

}