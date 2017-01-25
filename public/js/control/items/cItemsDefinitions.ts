const enum enumItemEquipType {
    weapon = 1,
    boots = 2,
    special = 3, //escudos, anillos, etc
    helmet = 4,
    armor = 5,
    others = 6,
}

class cItemsDefinitions {

    static defineItem(item:cItems) {

        switch (item.itemType) {
            case enumItemType.smallDager:
            case enumItemType.dager: 
            case enumItemType.javelin:
            case enumItemType.hammer:
            case enumItemType.sword:
            case enumItemType.wand:
            case enumItemType.bow:
            case enumItemType.specialDager:
                item.itemEquipType = enumItemEquipType.weapon              
                break;
            case enumItemType.gloves:
            case enumItemType.goldenGloves:
            case enumItemType.leaderGloves:
            case enumItemType.shield:
            case enumItemType.bigShield:
                item.itemEquipType = enumItemEquipType.special              
                break;
            case enumItemType.armor:
                item.itemEquipType = enumItemEquipType.armor              
                break;
            case enumItemType.boot:
                item.itemEquipType = enumItemEquipType.boots              
                break;
            case enumItemType.helmet:
                item.itemEquipType = enumItemEquipType.helmet              
                break;
            default:
                item.itemEquipType = enumItemEquipType.others
                break;
        }


    }
    

    static defineItemEfectsName(itemProperty:cItemProperty):string {

        var finalText:string = "";

        switch (itemProperty.itemEfect) {
            case enumItemEfects.life:
                finalText = "Life: +" + itemProperty.value;
                break;
            case enumItemEfects.mana:
                finalText = "Mana: +" + itemProperty.value;
                break;
            case enumItemEfects.energy:
                finalText = "Energy: +" + itemProperty.value;
                break;
            case enumItemEfects.normalLife:
                finalText = "Speed Normal Life: +" + itemProperty.value + "%";
                break;
            case enumItemEfects.normalMana:
                finalText = "Speed Normal Mana: +" + itemProperty.value + "%";
                break;
            case enumItemEfects.normalEnergy:
                finalText = "Speed Normal Energy: +" + itemProperty.value + "%";
                break;
            case enumItemEfects.focusLife:
                finalText = "Speed Focus Life: +" + itemProperty.value + "%";
                break;
            case enumItemEfects.focusMana:
                finalText = "Speed Focus Mana: +" + itemProperty.value + "%";
                break;
            case enumItemEfects.focusEnergy:
                finalText = "Speed Focus Energy: +" + itemProperty.value + "%";
                break;
            case enumItemEfects.atack:
                finalText = "Atack: +" + itemProperty.value;
                break;
            case enumItemEfects.defense:
                finalText = "Defense: +" + itemProperty.value;
                break;
            default:
                break;
        }

        return finalText
    }



}