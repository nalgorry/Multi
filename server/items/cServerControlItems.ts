import {cServerItems} from './cServerItems';
import {cServerItemDef} from './cServerItemDef';


export class cServerControlItems {

    public arrayItems:cServerItems[];
    private nextIdItems:number = 0;

    constructor(public socket:SocketIO.Server){

        this.arrayItems = [];

        //defino todos los objetos
        cServerItemDef.defineItems();

        for (var i = 0; i<5;i++) {

            var itemId = "i" + this.nextIdItems;

            var newItem = new cServerItems(socket, itemId, i, 10 , 40 + i, 95);
            this.arrayItems[itemId] = newItem; 
            this.nextIdItems += 1;
        }

    }



    public dropItemToFloor(data) {

        var itemDrop = this.arrayItems[data.itemId];

        if (itemDrop != undefined)  {
            itemDrop.tileX = data.tileX;
            itemDrop.tileY = data.tileY;
            itemDrop.onFloor = true;
            itemDrop.emitNewItem(this.socket)
        } else {
            console.log("itemNoEncontrado");
        }

    }

    public createNewRandomItem(itemLevel, tileX:number, tileY:number) {
        
        var itemType = cServerItemDef.getRandomItemDef();

        if (itemType != undefined) {
            this.createNewItem(itemType, itemLevel, tileX, tileY);
        } else {
            console.log("item no definido correctamente");
        }

    }

    public createNewItem(itemType:number, itemLevel, tileX:number, tileY:number) {

        var itemId = "i" + this.nextIdItems;
        var newItem = new cServerItems(this.socket, itemId, itemType, itemLevel, tileX, tileY);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;
    }

    public onNewPlayerConected(socket:SocketIO.Server) {

        //le mando al nuevo cliente todos los moustros del mapa
        for (var item in this.arrayItems) {
            this.arrayItems[item].emitNewItem(socket);    
        }

    }

    public getItemById(id:string):cServerItems {
        return this.arrayItems[id];
    }

    public youGetItem(socket:SocketIO.Server, data) {
    
      var item = this.getItemById(data.itemID)

      if (item != undefined) {
        
        item.youGetItem(socket, data);

      } else {
          console.log("el item ya fue agarrado");
      }

    }

    private randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }


}