class cControlItems {

    private arrayItems:cItems[];
    private arrayInventoryItems:cItems[];
    private arrayEquipedItems:cItems[];
    private arrayfreeInventoryItems:number[];
    public arrayItemEfects:cItemProperty[];

    public rectInventoryItem:Phaser.Graphics;
    public selectedItem:cItems;
    public itemsGroup:Phaser.Group;


    constructor(public controlGame:cControlGame) {

        this.arrayItems = [];
        this.arrayEquipedItems = [];
        this.arrayInventoryItems = [];
        this.arrayfreeInventoryItems = [];
        this.arrayItemEfects = [];

        //defino los lugares del inventario disponibles
        for(var i = 1; i <= 12 ; i++ ) {
            this.arrayfreeInventoryItems.push(i);
        }

        //armo el cuadrado para el item seleccionado en el inventario
        this.rectInventoryItem = this.controlGame.game.add.graphics(0,0);
        this.rectInventoryItem.lineStyle(2, 0x000000, 1);
        this.rectInventoryItem.fixedToCamera = true;
        this.rectInventoryItem.drawRect(0, 0, 40,40);

        this.rectInventoryItem.visible = false;

    }

    public newItem(data) {

        var item = new cItems(this.controlGame,data.itemID,data.itemType,data.maxRank);
        item.putItemInTile(data.tileX,data.tileY);

        this.arrayItems[data.itemID] = item;

        item.signalItemOnFloorClick.add(this.itemOnFloorClick,this); //agrego una señal para despues poder hacer click en el item

        var a = new Event('hola');
        

    }
    
    //esto pasa cuando alguien cualquiera levanta un item, o el server lo borra
    public itemGet(data) {

        var item = this.arrayItems[data.itemID];
        
        if (item != undefined) {
            item.deleteItem()
            delete this.arrayItems[data.itemID];
        }
        
    }

    //borra todos los items levantados y equipados
    public clearItems(){

        this.arrayEquipedItems.forEach(item => {
            item.deleteItem();
        })

        this.arrayInventoryItems.forEach(item => {
            item.deleteItem();
        })

        this.arrayEquipedItems = [];
        this.arrayInventoryItems = [];
        
        //defino los lugares del inventario disponibles
        for(var i = 1; i <= 12 ; i++ ) {
            this.arrayfreeInventoryItems.push(i);
        }

    }

    //pongo el item en el inventario
    public youGetItem(data) {

        var item =  new cItems(this.controlGame, data.itemID, data.itemType,data.maxRank);
        
        item.signalItemInventoryClick.add(this.itemClick,this); //agrego una señal para despues poder hacer click en el item  
        item.signalItemEquiped.add(this.itemEquiped,this); //agrego una señal para despues poder hacer click en el item
        item.signalItemDropToFloor.add(this.itemDropToFlor,this); //para cuando tira un item al piso

        //me fijo en que posición del inventario colocal el item 
        var itemPoss = this.arrayfreeInventoryItems.shift();
        if (itemPoss != undefined) { 
            item.putItemInInventory(itemPoss);

            //saco la info del item desde el server.
            data.itemEfects.forEach(property => {
                item.arrayItemEfects.push(new cItemProperty(property.itemEfect, property.value, property.propRank))
            })
        
            // agrego el item al array del inventario
            this.arrayInventoryItems.push(item);
        } else {
            this.controlGame.controlConsole.newMessage(enumMessage.information,"Your inventory is full");
        }

        //hago el sonido 
        this.controlGame.controlSounds.startSoundItemGet();            


    }

    //cuando el player decide tirar un item 
    public itemDropToFlor(item:cItems)  {

        if (item.itemEquiped == true) { //si el item esta equipado tengo que desequiparlo, y recalcular el efecto de los items
            delete this.arrayEquipedItems[item.itemEquipType];
            this.calculateItemsEfects();
            item.itemEquiped = false;
        } else { //si no esta equipado, lo remuevo del inventario y dejo libre el espacio para otro item
            this.arrayfreeInventoryItems.unshift(item.inventoryID);
        }

        var player = this.controlGame.controlPlayer

        this.controlGame.controlServer.socket.emit('you drop item', { itemId: item.itemID, tileX: player.tileX, tileY: player.tileY});
        item.deleteItem()
        delete this.arrayItems[item.itemID];

        //hago el sonido 
        this.controlGame.controlSounds.startSoundItemDrop();     
        

    }

    public itemEquiped(item:cItems) {
        
        //me fijo si hay un item ya equipado
        var itemToReplace = this.arrayEquipedItems[item.itemEquipType];

        if (itemToReplace != undefined) {
                itemToReplace.sprite.cameraOffset.copyFrom(item.spriteOriginalPoss);
                itemToReplace.spriteOriginalPoss.copyFrom(item.spriteOriginalPoss);
                itemToReplace.inventoryID = item.inventoryID;
                itemToReplace.itemEquiped = false;
        } else {
            this.arrayfreeInventoryItems.unshift(item.inventoryID);
        }

        this.arrayEquipedItems[item.itemEquipType] = item;

        this.calculateItemsEfects();

        //hago el sonido 
        this.controlGame.controlSounds.startItemEquip();     

    }

    private calculateItemsEfects() {

        this.arrayItemEfects = []; //aca guardo todos los efectos de los items equipados, para aplicarlos al jugador

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
        this.arrayItemEfects[enumItemEfects.atack] = new cItemProperty(
            enumItemEfects.atack,this.controlGame.controlPlayer.controlFocus.maxAtack,0);
        this.arrayItemEfects[enumItemEfects.defense] = new cItemProperty(
            enumItemEfects.defense,this.controlGame.controlPlayer.controlFocus.maxDefence,0); 

        //sumo para todos los items los efectos de cada propiedad
        this.arrayEquipedItems.forEach(item => {
            
            item.arrayItemEfects.forEach(ItemProperty => {

                if (this.arrayItemEfects[ItemProperty.itemEfect] == undefined) {
                    this.arrayItemEfects[ItemProperty.itemEfect] = new cItemProperty(ItemProperty.itemEfect,ItemProperty.value,0)
                } else {
                    this.arrayItemEfects[ItemProperty.itemEfect].value += ItemProperty.value;
                }
                
            })

        });

        //ya tengo las propiedades de todos los items, simplemente aplico esas propiedades al pj activo.
        this.arrayItemEfects.forEach(efect => {
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
        this.controlGame.controlServer.socket.emit('you equip item', { itemsEfects: this.arrayItemEfects});

    }

    public itemOnFloorClick(item:cItems) {
        
        if (Math.abs(item.tileX - this.controlGame.controlPlayer.tileX) <= 2 && 
            Math.abs(item.tileY - this.controlGame.controlPlayer.tileY) <= 2 ) { //me fijo si estoy cerca
                if (this.arrayfreeInventoryItems.length > 0) { //me fijo si el inventario no esta lleno
                    this.controlGame.controlServer.socket.emit('you try get item', { itemID: item.itemID });
                } else { 
                    this.controlGame.controlConsole.newMessage(enumMessage.information,"Your inventory is full");
                }       
        } else {
            this.controlGame.controlConsole.newMessage(enumMessage.information,"The item is to far to grab");
        }

    }

    public itemClick(item:cItems) {

        this.rectInventoryItem.visible = true;
        this.rectInventoryItem.cameraOffset.x = item.sprite.cameraOffset.x;
        this.rectInventoryItem.cameraOffset.y = item.sprite.cameraOffset.y;

        this.selectedItem = item;

    }





}




