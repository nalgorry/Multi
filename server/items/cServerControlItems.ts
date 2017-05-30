import {cServerItems} from './cServerItems';
import {cServerItemDef} from './cServerItemDef';
import {Signal} from '../Signal';


export class cServerControlItems {

    public arrayItems:cServerItems[];
    private nextIdItems:number = 0;

    constructor(public socket:SocketIO.Server, public room){

        this.arrayItems = [];

        //defino todos los objetos
        cServerItemDef.defineItems();

    }

    //crea los items iniciales para cada jugador
    public createInitialItems(socket:SocketIO.Server)   {

        for (var i = 0; i<3; i++) {

            var itemId = "i" + this.nextIdItems;

            this.createNewItem(i, 10, 33 + i, 31, false, socket);

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
                this.emitNewItem(itemDrop)
            } else {
                this.emitNewItemtoPlayer(itemDrop, socket)
            }

            
        } else {
            console.log("itemNoEncontrado");
        }

    }

    public createNewRandomItem(itemLevel, tileX:number, tileY:number) {

        //defino si va a tirar un item u oro

        var random = this.randomIntFromInterval(1,10);

        if (random > 4) { //posiblidades de tirar un item 
            var itemType = cServerItemDef.getRandomItemDef();

            if (itemType != undefined) {
                this.createNewItem(itemType, itemLevel, tileX, tileY,true);
            } else {
                console.log("item no definido correctamente");
            }
        } else { //tiro oro
            this.createGoldItem(tileX, tileY);
        }

    }

    public createGoldItem(tileX, tileY) {
        var itemId = "i" + this.nextIdItems;

        var gold = this.randomIntFromInterval(1,100);

        var newItem = new cServerItems(itemId, enumItemType.gold, gold, tileX, tileY, true);

        this.emitNewItem(newItem);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;
    }

    public createNewItem(itemType:number, itemLevel, tileX:number, tileY:number,itemPublic:boolean, socket:SocketIO.Server = this.socket) {

        var itemId = "i" + this.nextIdItems;
        var newItem = new cServerItems(itemId, itemType, itemLevel, tileX, tileY,itemPublic);

        this.emitNewItem(newItem);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;

        //agrego una señal para definir cuando el item se borra del juego
        newItem.signalItemDelete.add(this.itemDeleted,this);
    }

        //this emit the item to all the players
        public emitNewItem(item:cServerItems) {

        if (item.onFloor == true) {
            var itemData =  {
                itemID:item.itemID,
                tileX:item.tileX, 
                tileY:item.tileY,
                itemType:item.itemType,
                maxRank: item.maxRank};
            this.socket.in(this.room).emit('new item', itemData);
        }

    }
    
    //this emit the item only to a player
    public emitNewItemtoPlayer (item:cServerItems, socket:SocketIO.Server) {
 
        if (item.onFloor == true) {
            var itemData =  {
                itemID:item.itemID,
                tileX:item.tileX, 
                tileY:item.tileY,
                itemType:item.itemType,
                maxRank: item.maxRank};

            socket.emit('new item', itemData);
        }

    }

    private itemDeleted(itemID:string) {

        this.socket.emit('delete item', {itemID:itemID});
        delete this.arrayItems[itemID];

    }

    public onNewPlayerConected(socket:SocketIO.Server) {

        //le mando al nuevo cliente todos los moustros del mapa
        for (var numItem in this.arrayItems) {
            
            var item:cServerItems = this.arrayItems[numItem];

            //controlo que el item sea para todos los jugadores.
            if (item.isPublic == true) {
                this.emitNewItem(item);   
            } 

        }

        this.createInitialItems(socket);

    }

    public getItemById(id:string):cServerItems {
        return this.arrayItems[id];
    }

    public youGetItem(socketPlayer:SocketIO.Server, data) {
    
      var item = this.getItemById(data.itemID)

      if (item != undefined) {
        if (item.onFloor == true) {

        var itemData = {};

        if (item.itemType == enumItemType.gold) {
            itemData =  {
                itemID:item.itemID,
                tileX:item.tileX, 
                tileY:item.tileY,
                itemType:item.itemType,
                totalGold: item.itemLevel,
            };

        } else {
            itemData = {
                itemID: item.itemID, 
                itemType:item.itemType,
                itemEfects: item.arrayItemProperties,
                maxRank: item.maxRank,
                };
        }
            //le mando al que agarro su item
            socketPlayer.emit('you get item', itemData );

            //le mando a todos que el item se agarro
            this.socket.in(this.room).emit('item get', {itemID: item.itemID})

            item.onFloor = false;
        }

      } else {
          console.log("el item ya fue agarrado");
      }
    }



    private randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }


}