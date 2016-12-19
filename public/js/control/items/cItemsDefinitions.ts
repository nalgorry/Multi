const enum enumItemEquipType {
    weapon = 1,
    boots = 2,
    special = 3, //escudos, anillos, etc
    helmet = 4,
}

class cItemsDefinitions {

    static defineItem(item:cItems) {

        switch (item.itemType) {
            case enumItemType.smallDager:
                item.itemEquipType = enumItemEquipType.weapon              
                break;
            case enumItemType.dager:
                item.itemEquipType = enumItemEquipType.weapon              
                break;
            case enumItemType.sword:
                item.itemEquipType = enumItemEquipType.weapon              
                break;
            default:
                break;
        }


    }


}