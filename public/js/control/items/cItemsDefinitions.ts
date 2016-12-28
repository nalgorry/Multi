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


}