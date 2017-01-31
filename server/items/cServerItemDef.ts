import {cItemProperty} from './cServerItems';

export class cServerItemDef {

    static maxNumberEfects:number = 10;

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
          var itemEquipType:enumItemEquipType;
          var itemFixEfect:enumItemEfects;

          switch (itemType) {
            case enumItemType.smallDager:
            case enumItemType.dager: 
            case enumItemType.javelin:
            case enumItemType.hammer:
            case enumItemType.sword:
            case enumItemType.wand:
            case enumItemType.bow:
            case enumItemType.specialDager:
                itemEquipType = enumItemEquipType.weapon;   
                itemFixEfect = enumItemEfects.atack;   
                break;
            case enumItemType.gloves:
            case enumItemType.goldenGloves:
            case enumItemType.leaderGloves:
            case enumItemType.shield:
            case enumItemType.bigShield:
                itemEquipType = enumItemEquipType.special;
                itemFixEfect = enumItemEfects.defense;              
                break;
            case enumItemType.armor:
                itemEquipType = enumItemEquipType.armor
                itemFixEfect = enumItemEfects.defense;              
                break;
            case enumItemType.boot:
                itemEquipType = enumItemEquipType.boots
                itemFixEfect = -1;         
                break;
            case enumItemType.helmet:
                itemEquipType = enumItemEquipType.helmet
                itemFixEfect = enumItemEfects.defense;              
                break;
            default:
                itemEquipType = enumItemEquipType.others
                itemFixEfect = -1 //no tiene efectos fijos
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

            var itemEfectType = this.randomIntFromInterval(0,this.maxNumberEfects);
            arrayPropTypes.push(itemEfectType);
        }


        var arrayItemProperties = []; //aca se guardan las propiedades finales que son enviadas al server

        console.log(itemLevel);

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

    static randomIntFromInterval(min,max):number
    {
        return Math.floor(Math.random()*(max-min+1)+min);
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
