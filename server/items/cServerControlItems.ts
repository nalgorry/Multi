import {cServerItems} from './cServerItems';
import {cServerItemDef} from './cServerItemDef';
import {Signal} from '../Signal';


export class cServerControlItems {

    public arrayItems:cServerItems[];
    private nextIdItems:number = 0;

    constructor(public socket:SocketIO.Server){

        this.arrayItems = [];

        //defino todos los objetos
        cServerItemDef.defineItems();

    }

    //crea los items iniciales para cada jugador
    public createInitialItems(socket:SocketIO.Server)   {

        for (var i = 0; i<3; i++) {

            var itemId = "i" + this.nextIdItems;

            this.createNewItem(i, 10, 47 + i, 60, false, socket);

        }


    }

    public dropItemToFloor(socket:any, data) {

        var itemDrop = this.arrayItems[data.itemId];

        if (itemDrop != undefined)  {
            itemDrop.tileX = data.tileX;
            itemDrop.tileY = data.tileY;
            itemDrop.onFloor = true;

            //si el item es publico todos lo ven el piso, sino solo el jugador que lo tiro
            if (itemDrop.isPublic == true) {
                itemDrop.emitNewItem(this.socket)
            } else {
                itemDrop.emitNewItem(socket)
            }

            
        } else {
            console.log("itemNoEncontrado");
        }

    }

    public createNewRandomItem(itemLevel, tileX:number, tileY:number) {
        
        var itemType = cServerItemDef.getRandomItemDef();

        if (itemType != undefined) {
            this.createNewItem(itemType, itemLevel, tileX, tileY,true);
        } else {
            console.log("item no definido correctamente");
        }

    }

    public createNewItem(itemType:number, itemLevel, tileX:number, tileY:number,itemPublic:boolean, socket:SocketIO.Server = this.socket) {

        var itemId = "i" + this.nextIdItems;
        var newItem = new cServerItems(socket, itemId, itemType, itemLevel, tileX, tileY,itemPublic);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;

        //agrego una señal para definir cuando el item se borra del juego
        newItem.signalItemDelete.add(this.itemDeleted,this);
    }

    private itemDeleted(itemID:string) {

        delete this.arrayItems[itemID];

    }

    public onNewPlayerConected(socket:SocketIO.Server) {

        //le mando al nuevo cliente todos los moustros del mapa
        for (var numItem in this.arrayItems) {
            
            var item:cServerItems = this.arrayItems[numItem];

            //controlo que el item sea para todos los jugadores.
            if (item.isPublic == true) {
                item.emitNewItem(socket);   
            } 

        }

        this.createInitialItems(socket);

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