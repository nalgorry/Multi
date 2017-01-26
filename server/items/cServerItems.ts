import {cServerItemDef} from './cServerItemDef';

export class cServerItems {

    public tileX:number;
    public tileY:number;
    public itemType:enumItemType;
    public itemID:string;
    public socket:SocketIO.Server;
    public onFloor:boolean = true;
    public maxRank:enumPropRank;

    private arrayItemProperties:cItemProperty[];

        
    private maxNumberItems:number = 21;

    constructor(socket:SocketIO.Server, itemID:string, itemType:enumItemType, tileX:number, tileY:number) {

        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;

        this.arrayItemProperties = [];

        this.defineItemsProperties(1);

        this.emitNewItem(this.socket);

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