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

        console.log(data);
        
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
        item.signalItemEquiped.add(this.itemEquiped,this); //agrego una señal para despues poder hacer click en el item
        item.signalItemDropToFloor.add(this.itemDropToFlor,this); //para cuando tira un item al piso

        this.inventoryItemId += 1;

        //saco la info del item desde el server.
        data.itemEfects.forEach(property => {
            item.arrayItemEfects.push(new cItemProperty(property.itemEfect,property.value))
        })

        

    }

    public itemDropToFlor(item:cItems)  {

        if (item.itemEquiped == true) { //si el item esta equipado tengo que desequiparlo, y recalcular el efecto de los items
            delete this.arrayEquipedItems[item.itemEquipType];
            this.calculateItemsEfects();
            item.itemEquiped = false;
        }

        var player = this.controlGame.controlPlayer

        this.controlGame.controlServer.socket.emit('you drop item', { itemId: item.itemID, tileX: player.tileX, tileY: player.tileY});
        item.deleteItem()
        delete this.arrayItems[item.itemID];

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

    private calculateItemsEfects() {

        var arrayItemEfects:cItemProperty[]; //aca guardo todos los efectos de los items equipados, para aplicarlos al jugador
        arrayItemEfects = [];

        //reseteo todas las estadisticas del player antes de aplicar las propiedades de los items
        this.controlGame.controlPlayer.controlFocus.maxLife =
            this.controlGame.controlPlayer.controlFocus.baseMaxLife;
        this.controlGame.controlPlayer.controlFocus.maxMana = 
            this.controlGame.controlPlayer.controlFocus.baseMaxMana;
        this.controlGame.controlPlayer.controlFocus.maxEnergy = 
            this.controlGame.controlPlayer.controlFocus.baseMaxEnergy;
        this.controlGame.controlPlayer.controlFocus.maxAtack = 
            this.controlGame.controlPlayer.controlFocus.baseMaxAtack;
        this.controlGame.controlPlayer.controlFocus.maxDefence = 
            this.controlGame.controlPlayer.controlFocus.baseMaxDefence;
        
        this.controlGame.controlPlayer.controlFocus.speedFocusLife = 
            this.controlGame.controlPlayer.controlFocus.baseSpeedFocusLife;
        this.controlGame.controlPlayer.controlFocus.speedFocusMana = 
            this.controlGame.controlPlayer.controlFocus.baseSpeedFocusMana;
        this.controlGame.controlPlayer.controlFocus.speedFocusEnergy = 
            this.controlGame.controlPlayer.controlFocus.baseSpeedFocusEnergy;

        this.controlGame.controlPlayer.controlFocus.speedNormalLife = 
            this.controlGame.controlPlayer.controlFocus.baseSpeedNormalLife;
        this.controlGame.controlPlayer.controlFocus.speedNormalMana = 
            this.controlGame.controlPlayer.controlFocus.baseSpeedNormalMana;
        this.controlGame.controlPlayer.controlFocus.speedNormalEnergy = 
            this.controlGame.controlPlayer.controlFocus.baseSpeedNormalEnergy;

        //el ataque y defensa la seteo para enviarlas al server
        arrayItemEfects[enumItemEfects.atack] = new cItemProperty(
            enumItemEfects.atack,this.controlGame.controlPlayer.controlFocus.maxAtack);
        arrayItemEfects[enumItemEfects.defense] = new cItemProperty(
            enumItemEfects.defense,this.controlGame.controlPlayer.controlFocus.maxDefence); 

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
                case enumItemEfects.atack:
                    this.controlGame.controlPlayer.controlFocus.maxAtack = efect.value;
                    break;
                case enumItemEfects.defense:
                    this.controlGame.controlPlayer.controlFocus.maxDefence = efect.value;
                    break;
                case enumItemEfects.normalLife:
                    this.controlGame.controlPlayer.controlFocus.speedNormalLife = 
                    this.controlGame.controlPlayer.controlFocus.baseSpeedNormalLife * (1 + efect.value / 100);
                    break
                case enumItemEfects.normalMana:
                    this.controlGame.controlPlayer.controlFocus.speedNormalMana = 
                    this.controlGame.controlPlayer.controlFocus.baseSpeedNormalMana * (1 + efect.value / 100);
                    break
                case enumItemEfects.normalEnergy:
                    this.controlGame.controlPlayer.controlFocus.speedNormalEnergy = 
                    this.controlGame.controlPlayer.controlFocus.baseSpeedNormalEnergy * (1 + efect.value / 100);
                    break
                case enumItemEfects.focusLife:
                    this.controlGame.controlPlayer.controlFocus.speedFocusLife = 
                    this.controlGame.controlPlayer.controlFocus.baseSpeedFocusLife * (1 + efect.value / 100);
                    break
                case enumItemEfects.focusMana:
                    this.controlGame.controlPlayer.controlFocus.speedFocusMana = 
                    this.controlGame.controlPlayer.controlFocus.baseSpeedFocusMana * (1 + efect.value / 100);
                    break
                case enumItemEfects.focusEnergy:
                    this.controlGame.controlPlayer.controlFocus.speedFocusEnergy = 
                    this.controlGame.controlPlayer.controlFocus.baseSpeedFocusEnergy * (1 + efect.value / 100);
                    break
            
                default:
                    break;
            }
        })

        //actualizo las estadisticas del jugador
        this.controlGame.controlPlayer.controlFocus.updateAtackDefence();
        this.controlGame.controlPlayer.controlFocus.SelectFocus(this.controlGame.controlPlayer.controlFocus.actualFocusSystem)

        //envio los items equipados al servidor
        this.controlGame.controlServer.socket.emit('you equip item', { itemsEfects: arrayItemEfects});

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




