export class cServerPortals {

    public mapName:string;
    public pvspAllowed:boolean;

    constructor (
        public idPortal:number,
        public x:number,
        public y:number,
        public newMapTileX:number,
        public newMapTileY:number,
        public active:boolean
        ) {

    }

}