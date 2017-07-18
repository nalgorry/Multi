"use strict";
var cServerItems_1 = require('./cServerItems');
var cServerItemDef = (function () {
    function cServerItemDef() {
    }
    //define las propiedades del items segun su nivel
    cServerItemDef.defineProperties = function (itemLevel, itemType) {
        var _this = this;
        //defino el minimo y maximo para cada propiedad 
        var valuesItemsEfect;
        valuesItemsEfect = [];
        valuesItemsEfect[6 /* atack */] = new cValuesItemsEfect(6 /* atack */, 2, 5, 5, 10, 10, 15, 15, 25);
        valuesItemsEfect[7 /* defense */] = new cValuesItemsEfect(6 /* atack */, 2, 5, 5, 10, 10, 15, 15, 25);
        valuesItemsEfect[5 /* energy */] = new cValuesItemsEfect(6 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[4 /* mana */] = new cValuesItemsEfect(6 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[3 /* life */] = new cValuesItemsEfect(6 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[2 /* speedEnergy */] = new cValuesItemsEfect(6 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[1 /* speedMana */] = new cValuesItemsEfect(6 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[0 /* speedLife */] = new cValuesItemsEfect(6 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        //me fijo que tipo de item es
        var itemDef = this.arrayItemsDeff[itemType];
        console.log(itemDef);
        var arrayPropTypes = []; //aca se guardan todas las propiedades del item 
        //defino la propiedad principal segun el tipo de objeto que es
        if (itemDef.itemFixEfect != -1) {
            arrayPropTypes.push(itemDef.itemFixEfect); //la agrego al array de prop
        }
        //agrego las propiedades adicionales aleatorias
        var aditionalProperties = 3;
        //si no tiene propiedad fija agrego una mas
        if (arrayPropTypes.length == 0) {
            aditionalProperties += 1;
        }
        var numberEfects = this.randomIntFromInterval(1, 3);
        for (var i = 0; i < numberEfects; i++) {
            var itemEfectType = this.randomIntFromInterval(0, this.maxNumberEfects - 1);
            arrayPropTypes.push(itemEfectType);
        }
        var arrayItemProperties = []; //aca se guardan las propiedades finales que son enviadas al server
        arrayPropTypes.forEach(function (itemProp) {
            var randomPropRank = _this.randomIntFromInterval(0, 1000); //normal silver gold etc.
            var propRank;
            if (randomPropRank < 850 - itemLevel) {
                propRank = 0 /* normal */;
            }
            else if (randomPropRank < 900 - itemLevel) {
                propRank = 1 /* silver */;
            }
            else if (randomPropRank < 990 - itemLevel) {
                propRank = 2 /* gold */;
            }
            else {
                propRank = 3 /* diamont */;
            }
            var min = 0;
            var max = 0;
            switch (propRank) {
                case 0 /* normal */:
                    min = valuesItemsEfect[itemProp].normalMin;
                    max = valuesItemsEfect[itemProp].normalMax;
                    break;
                case 1 /* silver */:
                    min = valuesItemsEfect[itemProp].silverMin;
                    max = valuesItemsEfect[itemProp].silverMax;
                    break;
                case 2 /* gold */:
                    min = valuesItemsEfect[itemProp].goldMin;
                    max = valuesItemsEfect[itemProp].goldMax;
                    break;
                case 3 /* diamont */:
                    min = valuesItemsEfect[itemProp].diamontMin;
                    max = valuesItemsEfect[itemProp].diamontMax;
                    break;
                default:
                    break;
            }
            var itemEfectValue = _this.randomIntFromInterval(min, max);
            arrayItemProperties.push(new cServerItems_1.cItemProperty(itemProp, itemEfectValue, propRank));
        });
        return arrayItemProperties;
    };
    //busca la propiedad con mayor rank dele item 
    cServerItemDef.getItemMaxRank = function (arrayItemProperties) {
        var maxRank = 0 /* normal */;
        arrayItemProperties.forEach(function (item) {
            if (item.propRank > maxRank) {
                maxRank = item.propRank;
            }
        });
        return maxRank;
    };
    //devuelve un item en forma totalmente aleatoria
    cServerItemDef.getRandomItemDef = function () {
        var arrayPosibleItems = [];
        //primero definimos el tipo de item 
        var randItemEquip = this.randomIntFromInterval(1, this.maxNumberOfItemEquipTypes);
        //busco la cantidad de item de ese tipo de item
        var numItemEquip = this.arrayItemByEquipType[randItemEquip].length;
        //elijo un item aleatoriamente de los items
        var randType = this.randomIntFromInterval(0, numItemEquip - 1);
        //devuelvo el item type
        return this.arrayItemByEquipType[randItemEquip][randType];
    };
    //aca defino todos los items y sus propiedades
    cServerItemDef.defineItems = function () {
        var _this = this;
        this.arrayItemsDeff = [];
        //defino los items, aca se deberian agregar todos los nuevos items que se crean
        //TODO cambiar a diccionario mejor. y contar cuantos hay de cada tipo.
        var item = new cItemDef();
        item.itemType = 0 /* smallDager */;
        item.itemEquipType = 1 /* weapon */;
        item.itemFixEfect = 6 /* atack */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 1 /* dager */;
        item.itemEquipType = 1 /* weapon */;
        item.itemFixEfect = 6 /* atack */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 2 /* sword */;
        item.itemEquipType = 1 /* weapon */;
        item.itemFixEfect = 6 /* atack */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 3 /* specialDager */;
        item.itemEquipType = 1 /* weapon */;
        item.itemFixEfect = 6 /* atack */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 4 /* javelin */;
        item.itemEquipType = 1 /* weapon */;
        item.itemFixEfect = 6 /* atack */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 5 /* hammer */;
        item.itemEquipType = 1 /* weapon */;
        item.itemFixEfect = 6 /* atack */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 6 /* wand */;
        item.itemEquipType = 1 /* weapon */;
        item.itemFixEfect = 6 /* atack */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 7 /* goldenGloves */;
        item.itemEquipType = 3 /* special */;
        item.itemFixEfect = 7 /* defense */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 8 /* bow */;
        item.itemEquipType = 1 /* weapon */;
        item.itemFixEfect = 6 /* atack */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 10 /* boot */;
        item.itemEquipType = 2 /* boots */;
        item.itemFixEfect = -1 /* none */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 11 /* gloves */;
        item.itemEquipType = 3 /* special */;
        item.itemFixEfect = 7 /* defense */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 12 /* helmet */;
        item.itemEquipType = 4 /* helmet */;
        item.itemFixEfect = 7 /* defense */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 13 /* armor */;
        item.itemEquipType = 5 /* armor */;
        item.itemFixEfect = 7 /* defense */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 14 /* leaderGloves */;
        item.itemEquipType = 3 /* special */;
        item.itemFixEfect = -1 /* none */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 20 /* shield */;
        item.itemEquipType = 3 /* special */;
        item.itemFixEfect = 7 /* defense */;
        this.arrayItemsDeff[item.itemType] = item;
        var item = new cItemDef();
        item.itemType = 21 /* bigShield */;
        item.itemEquipType = 3 /* special */;
        item.itemFixEfect = 7 /* defense */;
        this.arrayItemsDeff[item.itemType] = item;
        //lleno el array de los items por equip type para poder elegir aleatoriamente
        this.arrayItemByEquipType = [];
        for (var i = 1; i <= this.maxNumberOfItemEquipTypes; i++) {
            this.arrayItemByEquipType[i] = [];
        }
        this.arrayItemByEquipType[1 /* weapon */] = [];
        this.arrayItemByEquipType[2 /* boots */] = [];
        this.arrayItemByEquipType[3 /* special */] = [];
        this.arrayItemByEquipType[4 /* helmet */] = [];
        this.arrayItemByEquipType[5 /* armor */] = [];
        this.arrayItemByEquipType[6 /* others */] = [];
        this.arrayItemsDeff.forEach(function (item) {
            _this.arrayItemByEquipType[item.itemEquipType].push(item.itemType);
        });
    };
    cServerItemDef.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    cServerItemDef.maxNumberEfects = 8;
    cServerItemDef.maxNumberOfItemEquipTypes = 6;
    return cServerItemDef;
}());
exports.cServerItemDef = cServerItemDef;
var cValuesItemsEfect = (function () {
    function cValuesItemsEfect(itemEfect, normalMin, normalMax, silverMin, silverMax, goldMin, goldMax, diamontMin, diamontMax) {
        this.itemEfect = itemEfect;
        this.normalMin = normalMin;
        this.normalMax = normalMax;
        this.silverMin = silverMin;
        this.silverMax = silverMax;
        this.goldMin = goldMin;
        this.goldMax = goldMax;
        this.diamontMin = diamontMin;
        this.diamontMax = diamontMax;
    }
    return cValuesItemsEfect;
}());
var cItemDef = (function () {
    function cItemDef() {
    }
    return cItemDef;
}());
