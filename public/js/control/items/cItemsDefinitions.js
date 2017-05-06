var cItemsDefinitions = (function () {
    function cItemsDefinitions() {
    }
    cItemsDefinitions.defineItem = function (item) {
        switch (item.itemType) {
            case 0 /* smallDager */:
            case 1 /* dager */:
            case 4 /* javelin */:
            case 5 /* hammer */:
            case 2 /* sword */:
            case 6 /* wand */:
            case 8 /* bow */:
            case 3 /* specialDager */:
                item.itemEquipType = 1 /* weapon */;
                break;
            case 11 /* gloves */:
            case 7 /* goldenGloves */:
            case 14 /* leaderGloves */:
            case 20 /* shield */:
            case 21 /* bigShield */:
                item.itemEquipType = 3 /* special */;
                break;
            case 13 /* armor */:
                item.itemEquipType = 5 /* armor */;
                break;
            case 10 /* boot */:
                item.itemEquipType = 2 /* boots */;
                break;
            case 12 /* helmet */:
                item.itemEquipType = 4 /* helmet */;
                break;
            default:
                item.itemEquipType = 6 /* others */;
                break;
        }
    };
    cItemsDefinitions.defineItemEfectsName = function (itemProperty) {
        var finalText = "";
        switch (itemProperty.itemEfect) {
            case 3 /* life */:
                finalText = "Life: +" + itemProperty.value;
                break;
            case 4 /* mana */:
                finalText = "Mana: +" + itemProperty.value;
                break;
            case 5 /* energy */:
                finalText = "Energy: +" + itemProperty.value;
                break;
            case 0 /* speedLife */:
                finalText = "Speed Life: +" + itemProperty.value + "%";
                break;
            case 1 /* speedMana */:
                finalText = "Speed Mana: +" + itemProperty.value + "%";
                break;
            case 2 /* speedEnergy */:
                finalText = "Speed Energy: +" + itemProperty.value + "%";
                break;
            case 6 /* atack */:
                finalText = "Atack: +" + itemProperty.value;
                break;
            case 7 /* defense */:
                finalText = "Defense: +" + itemProperty.value;
                break;
            default:
                break;
        }
        return finalText;
    };
    return cItemsDefinitions;
}());
