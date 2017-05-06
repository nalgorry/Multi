var cControlItems = (function () {
    function cControlItems(controlGame) {
        this.controlGame = controlGame;
        this.totalGold = 0;
        this.arrayItems = [];
        this.arrayEquipedItems = [];
        this.arrayInventoryItems = [];
        this.arrayfreeInventoryItems = [];
        this.arrayItemEfects = [];
        //defino los lugares del inventario disponibles
        for (var i = 1; i <= 12; i++) {
            this.arrayfreeInventoryItems.push(i);
        }
        //armo el cuadrado para el item seleccionado en el inventario
        this.rectInventoryItem = this.controlGame.game.add.graphics(0, 0);
        this.rectInventoryItem.lineStyle(2, 0x000000, 1);
        this.rectInventoryItem.fixedToCamera = true;
        this.rectInventoryItem.drawRect(0, 0, 40, 40);
        this.rectInventoryItem.visible = false;
        //armo el texto donde va estar la cantidadd de oro
        var styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600 };
        this.textGold = this.controlGame.game.add.text(1130, 650, "0", styleText);
        this.textGold.fixedToCamera = true;
    }
    cControlItems.prototype.newItem = function (data) {
        var item = new cItems(this.controlGame, data.itemID, data.itemType, data.maxRank);
        item.putItemInTile(data.tileX, data.tileY);
        this.arrayItems[data.itemID] = item;
        item.signalItemOnFloorClick.add(this.itemOnFloorClick, this); //agrego una señal para despues poder hacer click en el item
    };
    //esto pasa cuando alguien cualquiera levanta un item, o el server lo borra
    cControlItems.prototype.itemGet = function (data) {
        var item = this.arrayItems[data.itemID];
        if (item != undefined) {
            item.deleteItem();
            delete this.arrayItems[data.itemID];
        }
    };
    //borra todos los items levantados y equipados
    cControlItems.prototype.clearItems = function () {
        var arrayIDEquipedItems = [];
        this.arrayEquipedItems.forEach(function (item) {
            arrayIDEquipedItems.push(item.itemEquipType);
        });
        //borro un equipado aleatorio, si existe alguno :P 
        if (arrayIDEquipedItems.length == 0)
            return;
        var possItemToDelete = this.controlGame.game.rnd.between(0, arrayIDEquipedItems.length - 1);
        var IDitemToDelete = arrayIDEquipedItems[possItemToDelete];
        var itemToDrop = this.arrayEquipedItems[IDitemToDelete];
        this.itemDropToFlor(itemToDrop);
    };
    cControlItems.prototype.createGoldText = function (text, tileX, tileY) {
        var styleHit = { font: "18px Arial", fill: "#616300", fontWeight: 900 };
        var completeText = this.controlGame.game.add.sprite(tileX * this.controlGame.gridSize, (tileY - 1) * this.controlGame.gridSize);
        //texto que se muestra
        var goldText = this.controlGame.game.add.text(0, 0, text, styleHit);
        //hago un recuadro blanco abajo del texto
        var rectangleBack = this.controlGame.game.add.bitmapData(goldText.width, 20);
        rectangleBack.ctx.beginPath();
        rectangleBack.ctx.rect(0, 0, goldText.width, 20);
        rectangleBack.ctx.fillStyle = '#ffffff';
        rectangleBack.ctx.fill();
        var textBack = this.controlGame.game.add.sprite(0, 0, rectangleBack);
        textBack.alpha = 0.6;
        completeText.addChild(textBack);
        completeText.addChild(goldText);
        var tweenText = this.controlGame.game.add.tween(completeText).to({ y: '-40' }, 1000, Phaser.Easing.Cubic.Out, true);
        tweenText.onComplete.add(this.removeTweenText, completeText);
    };
    cControlItems.prototype.removeTweenText = function (sprite) {
        sprite.destroy();
    };
    //pongo el item en el inventario
    cControlItems.prototype.youGetItem = function (data) {
        switch (data.itemType) {
            case 40 /* gold */:
                this.totalGold = parseInt(this.textGold.text) + parseInt(data.totalGold);
                this.textGold.text = this.totalGold.toString();
                this.createGoldText(data.totalGold, data.tileX, data.tileY);
                //hago el sonido 
                this.controlGame.controlSounds.startSoundItemGet();
                break;
            default:
                var item = new cItems(this.controlGame, data.itemID, data.itemType, data.maxRank);
                item.signalItemInventoryClick.add(this.itemClick, this); //agrego una señal para despues poder hacer click en el item  
                item.signalItemEquiped.add(this.itemEquiped, this); //agrego una señal para despues poder hacer click en el item
                item.signalItemDropToFloor.add(this.itemDropToFlor, this); //para cuando tira un item al piso
                //me fijo en que posición del inventario colocal el item 
                var itemPoss = this.arrayfreeInventoryItems.shift();
                if (itemPoss != undefined) {
                    item.putItemInInventory(itemPoss);
                    //saco la info del item desde el server.
                    data.itemEfects.forEach(function (property) {
                        item.arrayItemEfects.push(new cItemProperty(property.itemEfect, property.value, property.propRank));
                    });
                    // agrego el item al array del inventario
                    this.arrayInventoryItems.push(item);
                }
                else {
                    this.controlGame.controlConsole.newMessage(enumMessage.information, "Your inventory is full");
                }
                //hago el sonido 
                this.controlGame.controlSounds.startSoundItemGet();
                break;
        }
    };
    //cuando el player decide tirar un item 
    cControlItems.prototype.itemDropToFlor = function (item) {
        if (item.itemEquiped == true) {
            delete this.arrayEquipedItems[item.itemEquipType];
            this.calculateItemsEfects();
            item.itemEquiped = false;
        }
        else {
            this.arrayfreeInventoryItems.unshift(item.inventoryID);
        }
        var player = this.controlGame.controlPlayer;
        this.controlGame.controlServer.socket.emit('you drop item', { itemId: item.itemID, tileX: player.tileX, tileY: player.tileY });
        item.deleteItem();
        delete this.arrayItems[item.itemID];
        //hago el sonido 
        this.controlGame.controlSounds.startSoundItemDrop();
    };
    cControlItems.prototype.itemEquiped = function (item) {
        //me fijo si hay un item ya equipado
        var itemToReplace = this.arrayEquipedItems[item.itemEquipType];
        if (itemToReplace != undefined) {
            itemToReplace.sprite.cameraOffset.copyFrom(item.spriteOriginalPoss);
            itemToReplace.spriteOriginalPoss.copyFrom(item.spriteOriginalPoss);
            itemToReplace.inventoryID = item.inventoryID;
            itemToReplace.itemEquiped = false;
        }
        else {
            this.arrayfreeInventoryItems.unshift(item.inventoryID);
        }
        this.arrayEquipedItems[item.itemEquipType] = item;
        this.calculateItemsEfects();
        //hago el sonido 
        this.controlGame.controlSounds.startItemEquip();
    };
    cControlItems.prototype.calculateItemsEfects = function () {
        var _this = this;
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
        this.arrayItemEfects[6 /* atack */] = new cItemProperty(6 /* atack */, this.controlGame.controlPlayer.controlFocus.maxAtack, 0);
        this.arrayItemEfects[7 /* defense */] = new cItemProperty(7 /* defense */, this.controlGame.controlPlayer.controlFocus.maxDefence, 0);
        //sumo para todos los items los efectos de cada propiedad
        this.arrayEquipedItems.forEach(function (item) {
            item.arrayItemEfects.forEach(function (ItemProperty) {
                if (_this.arrayItemEfects[ItemProperty.itemEfect] == undefined) {
                    _this.arrayItemEfects[ItemProperty.itemEfect] = new cItemProperty(ItemProperty.itemEfect, ItemProperty.value, 0);
                }
                else {
                    _this.arrayItemEfects[ItemProperty.itemEfect].value += ItemProperty.value;
                }
            });
        });
        //ya tengo las propiedades de todos los items, simplemente aplico esas propiedades al pj activo.
        this.arrayItemEfects.forEach(function (efect) {
            switch (efect.itemEfect) {
                case 3 /* life */:
                    _this.controlGame.controlPlayer.controlFocus.maxLife =
                        _this.controlGame.controlPlayer.controlFocus.baseMaxLife + efect.value;
                    break;
                case 4 /* mana */:
                    _this.controlGame.controlPlayer.controlFocus.maxMana =
                        _this.controlGame.controlPlayer.controlFocus.baseMaxMana + efect.value;
                    break;
                case 5 /* energy */:
                    _this.controlGame.controlPlayer.controlFocus.maxEnergy =
                        _this.controlGame.controlPlayer.controlFocus.baseMaxEnergy + efect.value;
                    break;
                case 6 /* atack */:
                    _this.controlGame.controlPlayer.controlFocus.maxAtack = efect.value;
                    break;
                case 7 /* defense */:
                    _this.controlGame.controlPlayer.controlFocus.maxDefence = efect.value;
                    break;
                case 0 /* speedLife */:
                    _this.controlGame.controlPlayer.controlFocus.speedNormalLife =
                        _this.controlGame.controlPlayer.controlFocus.baseSpeedNormalLife * (1 + efect.value / 100);
                    _this.controlGame.controlPlayer.controlFocus.speedFocusLife =
                        _this.controlGame.controlPlayer.controlFocus.baseSpeedFocusLife * (1 + efect.value / 100);
                    break;
                case 1 /* speedMana */:
                    _this.controlGame.controlPlayer.controlFocus.speedNormalMana =
                        _this.controlGame.controlPlayer.controlFocus.baseSpeedNormalMana * (1 + efect.value / 100);
                    _this.controlGame.controlPlayer.controlFocus.speedFocusMana =
                        _this.controlGame.controlPlayer.controlFocus.baseSpeedFocusMana * (1 + efect.value / 100);
                    break;
                case 2 /* speedEnergy */:
                    _this.controlGame.controlPlayer.controlFocus.speedNormalEnergy =
                        _this.controlGame.controlPlayer.controlFocus.baseSpeedNormalEnergy * (1 + efect.value / 100);
                    _this.controlGame.controlPlayer.controlFocus.speedFocusEnergy =
                        _this.controlGame.controlPlayer.controlFocus.baseSpeedFocusEnergy * (1 + efect.value / 100);
                    break;
                default:
                    break;
            }
        });
        //actualizo las estadisticas del jugador
        this.controlGame.controlPlayer.controlFocus.updateAtackDefence();
        this.controlGame.controlPlayer.controlFocus.SelectFocus(this.controlGame.controlPlayer.controlFocus.actualFocusSystem);
        //envio los items equipados al servidor
        this.controlGame.controlServer.socket.emit('you equip item', { itemsEfects: this.arrayItemEfects });
    };
    cControlItems.prototype.itemOnFloorClick = function (item) {
        if (Math.abs(item.tileX - this.controlGame.controlPlayer.tileX) <= 2 &&
            Math.abs(item.tileY - this.controlGame.controlPlayer.tileY) <= 2) {
            if (this.arrayfreeInventoryItems.length > 0) {
                this.controlGame.controlServer.socket.emit('you try get item', { itemID: item.itemID });
            }
            else {
                this.controlGame.controlConsole.newMessage(enumMessage.information, "Your inventory is full");
            }
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
