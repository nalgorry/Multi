var cControlItems = (function () {
    function cControlItems(controlGame) {
        this.controlGame = controlGame;
        this.inventoryItemId = 1;
        this.arrayItems = [];
        this.arrayEquipedItems = [];
        //armo el cuadrado para el item seleccionado en el inventario
        this.rectInventoryItem = this.controlGame.game.add.graphics(0, 0);
        this.rectInventoryItem.lineStyle(2, 0x000000, 1);
        this.rectInventoryItem.fixedToCamera = true;
        this.rectInventoryItem.drawRect(0, 0, 40, 40);
        this.rectInventoryItem.visible = false;
    }
    cControlItems.prototype.newItem = function (data) {
        var item = new cItems(this.controlGame, data.itemID, data.itemType);
        item.putItemInTile(data.tileX, data.tileY);
        this.arrayItems[data.itemID] = item;
        item.signalItemOnFloorClick.add(this.itemOnFloorClick, this); //agrego una señal para despues poder hacer click en el item
    };
    //esto pasa cuando alguien cualquiera levanta un item, puede no ser el pj en juego
    cControlItems.prototype.itemGet = function (data) {
        var item = this.arrayItems[data.itemID];
        if (item != undefined) {
            item.deleteItem();
            delete this.arrayItems[data.itemID];
        }
    };
    //pongo el item en el inventario
    cControlItems.prototype.youGetItem = function (data) {
        console.log(data);
        var item = new cItems(this.controlGame, data.itemID, data.itemType);
        item.putItemInInventory(this.inventoryItemId);
        item.signalItemInventoryClick.add(this.itemClick, this); //agrego una señal para despues poder hacer click en el item  
        item.signalItemEquiped.add(this.itemEquiped, this); //agrego una señal para despues poder hacer click en el item
        this.inventoryItemId += 1;
        //saco la info del item desde el server.
        data.itemEfects.forEach(function (property) {
            item.arrayItemEfects.push(new cItemProperty(property.itemEfect, property.value));
        });
    };
    cControlItems.prototype.itemEquiped = function (item) {
        //me fijo si hay un item ya equipado
        var itemToReplace = this.arrayEquipedItems[item.itemEquipType];
        if (itemToReplace != undefined) {
            itemToReplace.sprite.cameraOffset.copyFrom(item.spriteOriginalPoss);
            itemToReplace.spriteOriginalPoss.copyFrom(item.spriteOriginalPoss);
        }
        this.arrayEquipedItems[item.itemEquipType] = item;
        this.calculateItemsEfects();
    };
    cControlItems.prototype.calculateItemsEfects = function () {
        var _this = this;
        var arrayItemEfects; //aca guardo todos los efectos de los items equipados, para aplicarlos al jugador
        arrayItemEfects = [];
        //sumo para todos los items los efectos de cada propiedad
        this.arrayEquipedItems.forEach(function (item) {
            item.arrayItemEfects.forEach(function (ItemProperty) {
                if (arrayItemEfects[ItemProperty.itemEfect] == undefined) {
                    arrayItemEfects[ItemProperty.itemEfect] = new cItemProperty(ItemProperty.itemEfect, ItemProperty.value);
                }
                else {
                    arrayItemEfects[ItemProperty.itemEfect].value += ItemProperty.value;
                }
            });
        });
        //reseteo todas las estadisticas del player antes de aplicar las propiedades de los items
        this.controlGame.controlPlayer.controlFocus.maxLife =
            this.controlGame.controlPlayer.controlFocus.baseMaxLife;
        this.controlGame.controlPlayer.controlFocus.maxMana =
            this.controlGame.controlPlayer.controlFocus.baseMaxMana;
        this.controlGame.controlPlayer.controlFocus.maxEnergy =
            this.controlGame.controlPlayer.controlFocus.baseMaxEnergy;
        //ya tengo las propiedades de todos los items, simplemente aplico esas propiedades al pj activo.
        arrayItemEfects.forEach(function (efect) {
            switch (efect.itemEfect) {
                case 6 /* life */:
                    _this.controlGame.controlPlayer.controlFocus.maxLife =
                        _this.controlGame.controlPlayer.controlFocus.baseMaxLife + efect.value;
                    break;
                case 7 /* mana */:
                    _this.controlGame.controlPlayer.controlFocus.maxMana =
                        _this.controlGame.controlPlayer.controlFocus.baseMaxMana + efect.value;
                    break;
                case 8 /* energy */:
                    _this.controlGame.controlPlayer.controlFocus.maxEnergy =
                        _this.controlGame.controlPlayer.controlFocus.baseMaxEnergy + efect.value;
                    break;
                default:
                    break;
            }
        });
    };
    cControlItems.prototype.itemOnFloorClick = function (item) {
        if (Math.abs(item.tileX - this.controlGame.controlPlayer.tileX) <= 1 &&
            Math.abs(item.tileY - this.controlGame.controlPlayer.tileY) <= 1) {
            this.controlGame.controlServer.socket.emit('you try get item', { itemID: item.itemID });
        }
        else {
            this.controlGame.controlConsole.newMessage(enumMessage.information, "The item is to far to grab");
        }
    };
    cControlItems.prototype.itemClick = function (item) {
        this.rectInventoryItem.visible = true;
        this.rectInventoryItem.cameraOffset.x = item.sprite.cameraOffset.x;
        this.rectInventoryItem.cameraOffset.y = item.sprite.cameraOffset.y;
        this.selectedItem = item;
    };
    return cControlItems;
}());
