import {cServerItemDef} from './cServerItemDef';
import {Signal} from '../Signal';

export class cServerItems {

    public tileX:number;
    public tileY:number;
    public itemType:enumItemType;
    public itemID:string;
    public socket:SocketIO.Server;
    public onFloor:boolean = true;
    public maxRank:enumPropRank;
    public itemLevel:number;

    private itemDeleteTime:number = 20000;
    public signalItemDelete:Signal
    
    private arrayItemProperties:cItemProperty[];

    private maxNumberItems:number = 21;

    constructor(socket:SocketIO.Server, itemID:string, itemType:enumItemType, itemLevel:number , tileX:number, tileY:number) {

        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;
        this.itemLevel = itemLevel;

        this.signalItemDelete = new Signal();

        this.arrayItemProperties = [];

        this.defineItemsProperties(this.itemLevel);

        this.emitNewItem(this.socket);

        var itemTime = setTimeout(() => this.deleteItem(), this.itemDeleteTime);

    }

    //si pasa un tiempo sin que nadie levante el item lo borro
    private deleteItem() {

        if (this.onFloor == true) {

            this.socket.emit('delete item', {itemID:this.itemID});
            this.onFloor = false;

            this.signalItemDelete.dispatch(this.itemID);

        } else {
            var itemTime = setTimeout(() => this.deleteItem(), this.itemDeleteTime);
        }

        

    }


    public emitNewItem(socket:SocketIO.Server) {


        //emito el item si esta en el piso 
        if (this.onFloor == true) {

            var itemData =  {
                itemID:this.itemID,
                tileX:this.tileX, 
                tileY:this.tileY,
                itemType:this.itemType,
                maxRank: this.maxRank};

            socket.emit('new item', itemData);

        }

    }

    public defineItemsProperties(itemLevel:number) {

        this.arrayItemProperties = cServerItemDef.defineProperties(itemLevel,this.itemType);
        this.maxRank = cServerItemDef.getItemMaxRank(this.arrayItemProperties)

    }

    public youGetItem(socket:SocketIO.Server,data) {

        var itemData = {
            itemID: this.itemID, 
            itemType:this.itemType,
            itemEfects: this.arrayItemProperties,
            maxRank: this.maxRank
            }

        //le mando al que agarro su item
        socket.emit('you get item', itemData );

        //le mando a todos que el item se agarro
        this.socket.emit('item get', {itemID: this.itemID})

        this.onFloor = false;
 
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