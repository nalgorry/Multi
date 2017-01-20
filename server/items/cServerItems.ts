export class cServerItems {

    public tileX:number;
    public tileY:number;
    public itemType:number;
    public itemID:string;
    public socket:SocketIO.Server;
    public onFloor:boolean = true;

    private arrayItemProperties:cItemProperty[];

        
    private maxNumberItems:number = 21;
    private maxNumberEfects:number = 10;

    constructor(socket:SocketIO.Server, itemID:string, itemType:enumItemType, tileX:number, tileY:number) {

        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;

        this.arrayItemProperties = [];

        this.defineItemsProperties(1);

        this.emitNewItem();

    }


    public emitNewItem() {


        //emito el item si esta en el piso 
        if (this.onFloor == true) {

            var itemData =  {
                itemID:this.itemID,
                tileX:this.tileX, 
                tileY:this.tileY,
                itemType:this.itemType};

            this.socket.emit('new item', itemData);

        }

    }

    public defineItemsProperties(itemLevel:number) {

        var numberEfects = this.randomIntFromInterval(1,3);

        for (var i = 0; i < numberEfects; i++) {
            var itemEfect = this.randomIntFromInterval(0,this.maxNumberEfects);
            var itemEfectValue = this.randomIntFromInterval(1,25);

            this.arrayItemProperties.push(new cItemProperty(itemEfect,itemEfectValue));
        }

    }

    public youGetItem(socket:SocketIO.Server,data) {

        var itemData = {
            itemID: this.itemID, 
            itemType:this.itemType,
            itemEfects: this.arrayItemProperties
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

class cItemProperty {

    constructor(public itemEfect:enumItemEfects,public value:number) {

    }

}