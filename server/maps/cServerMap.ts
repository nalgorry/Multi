import {cServerPortals} from './cServerPortals';
import {cServerMonster} from './../cServerMonster';

export class cServerMap {

    public arrayPortals:cServerPortals[] = [];
    public arrayMonster:cServerMonster[] =[];
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

        //lets get the fixed moster for the map
        if (JSONMapData.monsters != undefined) {
            JSONMapData.monsters.forEach (monsterData => {

                var monster = new cServerMonster ();

                monster.defineMonster(
                    monsterData.monsterType,
                    monsterData.monsterRespawn,
                    monsterData.isPublic,
                    monsterData.tileX,
                    monsterData.tileY
                );

                this.arrayMonster.push(monster);
                
                console.log(this.arrayMonster);

                
            });
        }

    }

}

}