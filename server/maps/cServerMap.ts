import {cServerPortals} from './cServerPortals';
import {cServerMonster} from './../cServerMonster';
import {cServerItems} from './../items/cServerItems';

export class cServerMap {

    public arrayPortals:cServerPortals[] = [];
    public arrayMonster:cServerMonster[] =[];
    public arrayItems:cServerItems[] =[];
    public arrayMonsterTypes:number[] = [];
    public id:number;
    public mapName:string; 
    public file:string; 
    public monsterNumber:number;
    public pvspAllowed: boolean;

    constructor (JSONMapData) {

        this.id = JSONMapData.id; 
        this.mapName = JSONMapData.mapName; 
        this.file = JSONMapData.file;
        this.monsterNumber = JSONMapData.monsterNumber;
        this.arrayMonsterTypes = JSONMapData.monsterTypes;
        this.pvspAllowed = JSONMapData.PvsPAlowed;

        //lets add the portals to the map
        if (JSONMapData.portals != undefined) {
            JSONMapData.portals.forEach (portal => {
                
                this.arrayPortals.push(new cServerPortals(
                    portal.idPortal, 
                    portal.x, 
                    portal.y,
                    portal.newMapTileX,
                    portal.newMapTileY,
                    portal.active
                    ))
            });

        }

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
                                
            });
        }
        
        //lets add the items of the map! NICE :)
        if (JSONMapData.items != undefined) {
            JSONMapData.items.forEach (itemData => {

                var item = new cServerItems ();

                item.defineItem(
                    itemData.itemType,
                    itemData.itemLevel,
                    itemData.tileX,
                    itemData.tileY,
                    itemData.isPublic
                )

                this.arrayItems.push(item);
                                
            });

        }

    }


}
