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
        valuesItemsEfect[9 /* atack */] = new cValuesItemsEfect(9 /* atack */, 2, 5, 5, 10, 10, 15, 15, 25);
        valuesItemsEfect[10 /* defense */] = new cValuesItemsEfect(9 /* atack */, 2, 5, 5, 10, 10, 15, 15, 25);
        valuesItemsEfect[8 /* energy */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[7 /* mana */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[6 /* life */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[2 /* focusEnergy */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[1 /* focusMana */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[0 /* focusLife */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[5 /* normalEnergy */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[4 /* normalMana */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[3 /* normalLife */] = new cValuesItemsEfect(9 /* atack */, 5, 20, 20, 30, 30, 40, 45, 50);
        //me fijo que tipo de item es
        var itemEquipType;
        var itemFixEfect;
        switch (itemType) {
            case 0 /* smallDager */:
            case 1 /* dager */:
            case 4 /* javelin */:
            case 5 /* hammer */:
            case 2 /* sword */:
            case 6 /* wand */:
            case 8 /* bow */:
            case 3 /* specialDager */:
                itemEquipType = 1 /* weapon */;
                itemFixEfect = 9 /* atack */;
                break;
            case 11 /* gloves */:
            case 7 /* goldenGloves */:
            case 14 /* leaderGloves */:
            case 20 /* shield */:
            case 21 /* bigShield */:
                itemEquipType = 3 /* special */;
                itemFixEfect = 10 /* defense */;
                break;
            case 13 /* armor */:
                itemEquipType = 5 /* armor */;
                itemFixEfect = 10 /* defense */;
                break;
            case 10 /* boot */:
                itemEquipType = 2 /* boots */;
                itemFixEfect = -1;
                break;
            case 12 /* helmet */:
                itemEquipType = 4 /* helmet */;
                itemFixEfect = 10 /* defense */;
                break;
            default:
                itemEquipType = 6 /* others */;
                itemFixEfect = -1; //no tiene efectos fijos
                break;
        }
        var arrayPropTypes = []; //aca se guardan todas las propiedades del item 
        //defino la propiedad principal segun el tipo de objeto que es
        if (itemFixEfect != -1) {
            arrayPropTypes.push(itemFixEfect); //la agrego al array de prop
        }
        //agrego las propiedades adicionales aleatorias
        var numberEfects = this.randomIntFromInterval(1, 3);
        for (var i = 0; i < numberEfects; i++) {
            var itemEfectType = this.randomIntFromInterval(0, this.maxNumberEfects);
            arrayPropTypes.push(itemEfectType);
        }
        var arrayItemProperties = []; //aca se guardan las propiedades finales que son enviadas al server
        arrayPropTypes.forEach(function (itemProp) {
            var randomPropRank = _this.randomIntFromInterval(0, 1000); //normal silver gold etc.
            var propRank;
            if (randomPropRank < 500) {
                propRank = 0 /* normal */;
            }
            else if (randomPropRank < 700) {
                propRank = 1 /* silver */;
            }
            else if (randomPropRank < 950) {
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
    cServerItemDef.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
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
    cServerItemDef.maxNumberEfects = 10;
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
