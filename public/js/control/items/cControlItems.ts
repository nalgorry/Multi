class cControlItems {

    private arrayItems:cItems[];
    private arrayEquipedItems:cItems[];
    private inventoryItemId:number = 1;
    public rectInventoryItem:Phaser.Graphics;
    public selectedItem:cItems;
    public itemsGroup:Phaser.Group;

    constructor(public controlGame:cControlGame) {

        this.arrayItems = [];
        this.arrayEquipedItems = [];

        //armo el cuadrado para el item seleccionado en el inventario
        this.rectInventoryItem = this.controlGame.game.add.graphics(0,0);
        this.rectInventoryItem.lineStyle(2, 0x000000, 1);
        this.rectInventoryItem.fixedToCamera = true;
        this.rectInventoryItem.drawRect(0, 0, 40,40);

        this.rectInventoryItem.visible = false;

    }

    public newItem(data) {

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

        console.log(data);

        var item =  new cItems(this.controlGame, data.itemID, data.itemType);
        
        item.putItemInInventory(this.inventoryItemId);
        item.signalItemInventoryClick.add(this.itemClick,this); //agrego una señal para despues poder hacer click en el item  
        item.signalItemEquiped.add(this.itemEquiped,this); //agrego una señal para despues poder hacer click en el item

        this.inventoryItemId += 1;

        //saco la info del item desde el server.
        data.itemEfects.forEach(property => {
            item.arrayItemEfects.push(new cItemProperty(property.itemEfect,property.value))
        })

        

    }

    public itemEquiped(item:cItems) {
        
        //me fijo si hay un item ya equipado
        var itemToReplace = this.arrayEquipedItems[item.itemEquipType];

        if (itemToReplace != undefined) {
                itemToReplace.sprite.cameraOffset.copyFrom(item.spriteOriginalPoss);
                itemToReplace.spriteOriginalPoss.copyFrom(item.spriteOriginalPoss);
        }

        this.arrayEquipedItems[item.itemEquipType] = item;

        this.calculateItemsEfects();

    }

    private calculateItemsEfects()   {

        var arrayItemEfects:cItemProperty[]; //aca guardo todos los efectos de los items equipados, para aplicarlos al jugador
        arrayItemEfects = [];

        //sumo para todos los items los efectos de cada propiedad
        this.arrayEquipedItems.forEach(item => {
            
            item.arrayItemEfects.forEach(ItemProperty => {

                if (arrayItemEfects[ItemProperty.itemEfect] == undefined) {
                    arrayItemEfects[ItemProperty.itemEfect] = new cItemProperty(ItemProperty.itemEfect,ItemProperty.value)
                } else {
                    arrayItemEfects[ItemProperty.itemEfect].value += ItemProperty.value;
                }
                
            })

        });

        //reseteo todas las estadisticas del player antes de aplicar las propiedades de los items
        this.controlGame.controlPlayer.controlFocus.maxLife =
            this.controlGame.controlPlayer.controlFocus.baseMaxLife
        this.controlGame.controlPlayer.controlFocus.maxMana = 
            this.controlGame.controlPlayer.controlFocus.baseMaxMana
        this.controlGame.controlPlayer.controlFocus.maxEnergy = 
                        this.controlGame.controlPlayer.controlFocus.baseMaxEnergy

        //ya tengo las propiedades de todos los items, simplemente aplico esas propiedades al pj activo.
        arrayItemEfects.forEach(efect => {
            switch (efect.itemEfect) {
                case enumItemEfects.life:
                    this.controlGame.controlPlayer.controlFocus.maxLife = 
                        this.controlGame.controlPlayer.controlFocus.baseMaxLife + efect.value;
                    break;
                case enumItemEfects.mana:
                    this.controlGame.controlPlayer.controlFocus.maxMana = 
                        this.controlGame.controlPlayer.controlFocus.baseMaxMana + efect.value;
                    break;
                case enumItemEfects.energy:
                    this.controlGame.controlPlayer.controlFocus.maxEnergy = 
                        this.controlGame.controlPlayer.controlFocus.baseMaxEnergy + efect.value;
                    break;
            
                default:
                    break;
            }
        })

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




