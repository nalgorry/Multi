import {cServerItems} from './cServerItems';

export class cServerControlItems {

    public arrayItems:cServerItems[];
    private nextIdItems:number = 0;

    constructor(public socket:SocketIO.Server){

        this.arrayItems = [];
        
        var newItem = new cServerItems(socket,this.nextIdItems,1,50,5);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,5,40,5);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,8,35,10);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,1,44,4);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,2,44,5);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,3,44,6);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,4,44,7);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        
        var newItem = new cServerItems(socket,this.nextIdItems,5,45,4);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,6,45,5);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,7,45,6);
        this.arrayItems[this.nextIdItems] = newItem;
        this.nextIdItems += 1;

        var newItem = new cServerItems(socket,this.nextIdItems,8,45,7);
        this.arrayItems[this.nextIdItems] = newItem;
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
    
    console.log(data);
      var item = this.getItemById(data.itemID)

      if (item != undefined) {
        
        item.youGetItem(socket, data);

        delete this.arrayItems[item.itemID];

      } else {
          console.log("el item ya fue agarrado");
      }


    }


}