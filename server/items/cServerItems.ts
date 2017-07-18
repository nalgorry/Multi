import {cServerItemDef} from './cServerItemDef';
import {Signal} from '../Signal';

export class cServerItems {

    public tileX:number;
    public tileY:number;
    public itemType:enumItemType;
    public itemID:string;
    public onFloor:boolean = true;
    public maxRank:enumPropRank;
    public itemLevel:number;
    public isPublic:boolean = true;

    private itemDeleteTime:number = 200000;
    public signalItemDelete:Signal
    
    public arrayItemProperties:cItemProperty[];

    private maxNumberItems:number = 21;

    constructor() {

        this.signalItemDelete = new Signal();

        this.arrayItemProperties = [];

    }

    public defineItem(itemType:enumItemType, itemLevel:number , 
                        tileX:number, tileY:number, isPublic:boolean) {
    
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.itemLevel = itemLevel;
        this.isPublic = isPublic;

         if (itemType != enumItemType.gold) {
            this.defineItemsProperties(this.itemLevel);
        }
            
    }

    public defineId(itemId:string)  {
        this.itemID = itemId;

        //when the id is set it start to count the life time of this object in the map.
        var itemTime = setTimeout(() => this.deleteItem(), this.itemDeleteTime);

    }

    //si pasa un tiempo sin que nadie levante el item lo borro
    private deleteItem() {

        if (this.onFloor == true) {
            this.onFloor = false;
            this.signalItemDelete.dispatch(this.itemID);
        } else {
            var itemTime = setTimeout(() => this.deleteItem(), this.itemDeleteTime);
        }
    }

    public defineItemsProperties(itemLevel:number) {
        this.arrayItemProperties = cServerItemDef.defineProperties(itemLevel,this.itemType);
        this.maxRank = cServerItemDef.getItemMaxRank(this.arrayItemProperties)

    }

    public youGetItem(socket:SocketIO.Server,data) {
 
    }

    private randomIntFromInterval(min,max):number
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }


}

export class cItemProperty {

    constructor(public itemEfect:enumItemEfects,
        public value:number,
        public propRank:enumPropRank) {

    }

}