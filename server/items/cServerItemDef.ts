import {cItemProperty} from './cServerItems';

export class cServerItemDef {

    static arrayItemsDeff:cItemDef[];
    static arrayItemByEquipType:number[][]; //array de [itemEquipType][itemType] para poder seleccionar aleatoriamente por equiptype
    
    static maxNumberEfects:number = 10;
    static maxNumberOfItemEquipTypes:number = 6;

    //define las propiedades del items segun su nivel
    static defineProperties(itemLevel:number,itemType:enumItemType) {

        //defino el minimo y maximo para cada propiedad 
        var valuesItemsEfect:cValuesItemsEfect[];
        valuesItemsEfect = [];

        valuesItemsEfect[enumItemEfects.atack] = new cValuesItemsEfect(enumItemEfects.atack,2, 5, 5, 10, 10, 15, 15, 25);
        valuesItemsEfect[enumItemEfects.defense] = new cValuesItemsEfect(enumItemEfects.atack,2, 5, 5, 10, 10, 15, 15, 25);

        valuesItemsEfect[enumItemEfects.energy] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[enumItemEfects.mana] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[enumItemEfects.life] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);

        valuesItemsEfect[enumItemEfects.focusEnergy] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[enumItemEfects.focusMana] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[enumItemEfects.focusLife] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[enumItemEfects.normalEnergy] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[enumItemEfects.normalMana] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);
        valuesItemsEfect[enumItemEfects.normalLife] = new cValuesItemsEfect(enumItemEfects.atack,5, 20, 20, 30, 30, 40, 45, 50);

        //me fijo que tipo de item es
        var itemDef:cItemDef = this.arrayItemsDeff[itemType]

        var arrayPropTypes = []; //aca se guardan todas las propiedades del item 
        
        //defino la propiedad principal segun el tipo de objeto que es
        if (itemDef.itemFixEfect != -1) {
            arrayPropTypes.push(itemDef.itemFixEfect); //la agrego al array de prop
        }

        //agrego las propiedades adicionales aleatorias
        var aditionalProperties:number = 3 
        //si no tiene propiedad fija agrego una mas
        if (arrayPropTypes.length == 0) {
            aditionalProperties += 1;
        } 
        var numberEfects = this.randomIntFromInterval(1, 3);

        for (var i = 0; i < numberEfects; i++) {

            var itemEfectType = this.randomIntFromInterval(0,this.maxNumberEfects);
            arrayPropTypes.push(itemEfectType);
        }


        var arrayItemProperties = []; //aca se guardan las propiedades finales que son enviadas al server

        arrayPropTypes.forEach(itemProp => {

            var randomPropRank = this.randomIntFromInterval(0,1000); //normal silver gold etc.
            var propRank:enumPropRank; 

            if (randomPropRank < 850 - itemLevel) { //normal item 
                propRank = enumPropRank.normal;
            } else if (randomPropRank < 900 - itemLevel) { 
                propRank = enumPropRank.silver;
            }  else if (randomPropRank < 990 - itemLevel) { 
                propRank = enumPropRank.gold;
            } else { 
                propRank = enumPropRank.diamont;
            }
            
            var min:number = 0;
            var max:number = 0;

             switch (propRank) {
                case enumPropRank.normal:
                    min = valuesItemsEfect[itemProp].normalMin;
                    max = valuesItemsEfect[itemProp].normalMax;                
                    break;
                case enumPropRank.silver:
                    min = valuesItemsEfect[itemProp].silverMin;
                    max = valuesItemsEfect[itemProp].silverMax;                       
                    break;
                case enumPropRank.gold:
                    min = valuesItemsEfect[itemProp].goldMin;
                    max = valuesItemsEfect[itemProp].goldMax;                       
                    break;
                case enumPropRank.diamont:
                    min = valuesItemsEfect[itemProp].diamontMin;
                    max = valuesItemsEfect[itemProp].diamontMax;                       
                    break;
            
                default:
                    break;
            }

            var itemEfectValue = this.randomIntFromInterval(min,max);

            arrayItemProperties.push(new cItemProperty(itemProp,itemEfectValue,propRank));

        })

        return arrayItemProperties;

    }


    //busca la propiedad con mayor rank dele item 
    static getItemMaxRank(arrayItemProperties:cItemProperty[]) {
        var maxRank = enumPropRank.normal

        arrayItemProperties.forEach(item => {
            if (item.propRank > maxRank) {
                maxRank = item.propRank;
            }
        })

        return maxRank;

    }

    //devuelve un item en forma totalmente aleatoria
    static getRandomItemDef():enumItemType {

        var arrayPosibleItems = []
        
        //primero definimos el tipo de item 
        var randItemEquip:enumItemEquipType = this.randomIntFromInterval(1,this.maxNumberOfItemEquipTypes);

        //busco la cantidad de item de ese tipo de item
        var numItemEquip:number = this.arrayItemByEquipType[randItemEquip].length;

        //elijo un item aleatoriamente de los items
        var randType:enumItemType = this.randomIntFromInterval(0,numItemEquip - 1 );

        //devuelvo el item type
        return this.arrayItemByEquipType[randItemEquip][randType];

    }

    //aca defino todos los items y sus propiedades
    static defineItems() {
        this.arrayItemsDeff = [];

        //defino los items, aca se deberian agregar todos los nuevos items que se crean
        //TODO cambiar a diccionario mejor. y contar cuantos hay de cada tipo.
        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.smallDager;
        item.itemEquipType = enumItemEquipType.weapon;
        item.itemFixEfect = enumItemEfects.atack;
        this.arrayItemsDeff[item.itemType] =item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.dager;
        item.itemEquipType = enumItemEquipType.weapon;
        item.itemFixEfect = enumItemEfects.atack;
        this.arrayItemsDeff[item.itemType] =item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.sword;
        item.itemEquipType = enumItemEquipType.weapon;
        item.itemFixEfect = enumItemEfects.atack;
        this.arrayItemsDeff[item.itemType] =item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.specialDager;
        item.itemEquipType = enumItemEquipType.weapon;
        item.itemFixEfect = enumItemEfects.atack;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.javelin;
        item.itemEquipType = enumItemEquipType.weapon;
        item.itemFixEfect = enumItemEfects.atack;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.hammer;
        item.itemEquipType = enumItemEquipType.weapon;
        item.itemFixEfect = enumItemEfects.atack;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.wand;
        item.itemEquipType = enumItemEquipType.weapon;
        item.itemFixEfect = enumItemEfects.atack;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.goldenGloves;
        item.itemEquipType = enumItemEquipType.special;
        item.itemFixEfect = enumItemEfects.defense;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.bow;
        item.itemEquipType = enumItemEquipType.weapon;
        item.itemFixEfect = enumItemEfects.atack;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.boot;
        item.itemEquipType = enumItemEquipType.boots;
        item.itemFixEfect = enumItemEfects.none;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.gloves;
        item.itemEquipType = enumItemEquipType.special;
        item.itemFixEfect = enumItemEfects.defense;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.helmet;
        item.itemEquipType = enumItemEquipType.helmet;
        item.itemFixEfect = enumItemEfects.defense;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.armor;
        item.itemEquipType = enumItemEquipType.armor;
        item.itemFixEfect = enumItemEfects.defense;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.leaderGloves;
        item.itemEquipType = enumItemEquipType.special;
        item.itemFixEfect = enumItemEfects.none;
        this.arrayItemsDeff[item.itemType] = item;
        
        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.shield;
        item.itemEquipType = enumItemEquipType.special;
        item.itemFixEfect = enumItemEfects.defense;
        this.arrayItemsDeff[item.itemType] = item;

        var item:cItemDef = new cItemDef();
        item.itemType = enumItemType.bigShield;
        item.itemEquipType = enumItemEquipType.special;
        item.itemFixEfect = enumItemEfects.defense;
        this.arrayItemsDeff[item.itemType] = item;

        //lleno el array de los items por equip type para poder elegir aleatoriamente
        this.arrayItemByEquipType = [];

        for (var i = 1; i <= this.maxNumberOfItemEquipTypes; i++) {
            this.arrayItemByEquipType[i] = [];
        }

        this.arrayItemByEquipType[enumItemEquipType.weapon] = [];
        this.arrayItemByEquipType[enumItemEquipType.boots] = [];
        this.arrayItemByEquipType[enumItemEquipType.special] = [];
        this.arrayItemByEquipType[enumItemEquipType.helmet] = [];
        this.arrayItemByEquipType[enumItemEquipType.armor] = [];
        this.arrayItemByEquipType[enumItemEquipType.others] = [];

        this.arrayItemsDeff.forEach(item => {
            this.arrayItemByEquipType[item.itemEquipType].push(item.itemType);
        })

    }

    static randomIntFromInterval(min,max):number
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

}


class cValuesItemsEfect {

    constructor(public itemEfect:enumItemEfects,
        public normalMin:number,
        public normalMax:number,
        public silverMin:number,
        public silverMax:number,
        public goldMin:number,
        public goldMax:number,
        public diamontMin:number,
        public diamontMax:number
    ) {

    }

}

class cItemDef {
    public itemType:enumItemType;
    public itemEquipType:enumItemEquipType;
    public itemFixEfect:enumItemEfects;
    
}
