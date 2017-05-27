import {cServerPortals} from './cServerPortals';

export class cServerMap {

    public arrayPortals:cServerPortals[] = [];
    public id:number;
    public name:string; 
    public file:string; 
    public monsterNumber:number;

    constructor (JSONMapData) {

        this.id = JSONMapData.id; 
        this.name = JSONMapData.name; 
        this.file = JSONMapData.file;
        this.monsterNumber = JSONMapData.monsterNumber;

    }

}