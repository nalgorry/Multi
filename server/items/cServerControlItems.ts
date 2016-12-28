import {cServerItems} from './cServerItems';

export class cServerControlItems {

    public arrayItems:cServerItems[];
    private nextIdItems:number = 0;

    constructor(public socket:SocketIO.Server){

        this.arrayItems = [];
        

        for (var i = 0; i<30;i++) {
            var newItem = new cServerItems(socket,this.nextIdItems,i,40 + i,5);
            this.arrayItems[this.nextIdItems] = newItem;
            this.nextIdItems += 1;
        }
      


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