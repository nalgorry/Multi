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
        var item = new cItems(this.controlGame,data.itemID,data.itemType);
        item.putItemInTile(data.tileX,data.tileY);

        this.arrayItems[data.itemID] = item;

        item.signalItemOnFloorClick.add(this.itemOnFloorClick,this); //agrego una señal para despues poder hacer click en el item

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
        item.signalItemInventoryClick.add(this.itemClick,this); //agrego una señal para despues poder hacer click en el item  

        this.inventoryItemId += 1

    }

    public itemOnFloorClick(item:cItems) {
        
        if (Math.abs(item.tileX - this.controlGame.controlPlayer.tileX) <= 1 && 
            Math.abs(item.tileY - this.controlGame.controlPlayer.tileY) <= 1 ) {
                this.controlGame.controlServer.socket.emit('you try get item', { itemID: item.itemID });
        } else {
            this.controlGame.controlConsole.newMessage(enumMessage.information,"The item is to far to grab")
        }

    }

    public itemClick(item:cItems) {

        this.rectInventoryItem.visible = true;
        this.rectInventoryItem.cameraOffset.x = item.sprite.cameraOffset.x;
        this.rectInventoryItem.cameraOffset.y = item.sprite.cameraOffset.y;

        this.selectedItem = item;

    }





}




