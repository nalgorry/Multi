class cControlItems {

    private arrayItems:cItems[];
    private inventoryItemId:number = 1;
    public rectInventoryItem:Phaser.Graphics;
    public selectedItem:cItems;

    constructor(public controlGame:cControlGame) {

        this.arrayItems = [];

        //armo el cuadrado para el item seleccionado en el inventario
        this.rectInventoryItem = this.controlGame.game.add.graphics(0,0);
        this.rectInventoryItem.lineStyle(2, 0x000000, 1);
        this.rectInventoryItem.fixedToCamera = true;
        this.rectInventoryItem.drawRect(0, 0, 40,40);

        //this.rectInventoryItem.visible = false;

    }

    public newItem(data) {
        console.log(data);
        this.arrayItems[data.itemID] = new cItems(this.controlGame,data.itemID,data.itemType);
        this.arrayItems[data.itemID].putItemInTile(data.tileX,data.tileY);

    }

    public getItemFromTile() {
        for (var itemName in this.arrayItems) {
            var item = this.arrayItems[itemName];  
            
            if (item.tileX == this.controlGame.controlPlayer.tileX && 
                item.tileY == this.controlGame.controlPlayer.tileY) {
                    
                    this.controlGame.controlServer.socket.emit('you try get item', { itemID: item.itemID });
                    
                }  
        }
    
    }

    //esto pasa cuando alguien cualquiera levanta un item, puede no ser el pj en juego
    public itemGet(data) {
        
        var item = this.arrayItems[data.itemID];
        
        if (item != undefined) {
            item.deleteItem()
            delete this.arrayItems[data.itemID];
        }
        
    }

    //pongo el item en el inventario
    public youGetItem(data) {

        var item =  new cItems(this.controlGame, data.itemID, data.itemType);
        
        item.putItemInInventory(this.inventoryItemId);
        
        item.signalItemClick.add(this.itemClick,this); //agrego una señal para despues poder hacer click en el item  

        this.inventoryItemId += 1

    }

    public itemClick(item:cItems) {

        console.log(item);

        this.rectInventoryItem.visible = true;
        this.rectInventoryItem.cameraOffset.x = item.sprite.cameraOffset.x;
        this.rectInventoryItem.cameraOffset.y = item.sprite.cameraOffset.y;

        this.selectedItem = item;

    }





}




