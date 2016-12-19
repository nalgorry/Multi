export class cServerItems {

    public tileX:number;
    public tileY:number;
    public itemType:number;
    public itemID:number;
    public socket:SocketIO.Server;

    constructor(socket:SocketIO.Server, itemID:number, itemType:enumItemType, tileX:number, tileY:number) {

        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;

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

    public youGetItem(socket:SocketIO.Server,data) {

        //le mando al que agarro su item
        socket.emit('you get item', {itemID: this.itemID, itemType:this.itemType});

        //le mando a todos que el item se agarro
        this.socket.emit('item get', {itemID: this.itemID})
 
    }

}