export class cServerItems {

    public tileX:number;
    public tileY:number;
    public itemType:number;
    public itemID:number;
    public socket:SocketIO.Server;

    private arrayItemProperties:cItemProperty[];

        
    private maxNumberItems:number = 21;
    private maxNumberEfects:number = 10;

    constructor(socket:SocketIO.Server, itemID:number, itemType:enumItemType, tileX:number, tileY:number) {

        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;

        this.arrayItemProperties = [];

        this.defineItemsProperties(1);

        this.emitNewItem(socket);

    }


    public emitNewItem(socket:SocketIO.Server) {
        //emito el monstruo, si viene un socket es porque es un jugador nuevo y le mando solo a el los monstruos que ya existen
        var itemData =  {
            itemID:this.itemID,
            tileX:this.tileX, 
            tileY:this.tileY,
            itemType:this.itemType};

            socket.emit('new item', itemData);

    }

    public defineItemsProperties(itemLevel:number) {

        var itemEfect = this.randomIntFromInterval(0,this.maxNumberEfects);
        var itemEfectValue = this.randomIntFromInterval(1,25);

        this.arrayItemProperties.push(new cItemProperty(itemEfect,itemEfectValue));

        itemEfect = this.randomIntFromInterval(0,this.maxNumberEfects);
        itemEfectValue = this.randomIntFromInterval(1,25);

        this.arrayItemProperties.push(new cItemProperty(itemEfect,itemEfectValue));

    }

    public youGetItem(socket:SocketIO.Server,data) {

        console.log(this.arrayItemProperties);

        var itemData = {
            itemID: this.itemID, 
            itemType:this.itemType,
            itemEfects: this.arrayItemProperties
            }

        //le mando al que agarro su item
        socket.emit('you get item', itemData );

        //le mando a todos que el item se agarro
        this.socket.emit('item get', {itemID: this.itemID})
 
    }

    private randomIntFromInterval(min,max):number
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }


}

class cItemProperty {

    constructor(public itemEfect:enumItemEfects,public value:number) {

    }

}