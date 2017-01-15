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
            case 6 /* life */:
                finalText = "Life: +" + itemProperty.value;
                break;
            case 7 /* mana */:
                finalText = "Mana: +" + itemProperty.value;
                break;
            case 8 /* energy */:
                finalText = "Energy: +" + itemProperty.value;
                break;
            case 3 /* normalLife */:
                finalText = "Speed Normal Life: +" + itemProperty.value + "%";
                break;
            case 4 /* normalMana */:
                finalText = "Speed Normal Mana: +" + itemProperty.value + "%";
                break;
            case 5 /* normalEnergy */:
                finalText = "Speed Normal Energy: +" + itemProperty.value + "%";
                break;
            case 0 /* focusLife */:
                finalText = "Speed Focus Life: +" + itemProperty.value + "%";
                break;
            case 1 /* focusMana */:
                finalText = "Speed Focus Mana: +" + itemProperty.value + "%";
                break;
            case 2 /* focusEnergy */:
                finalText = "Speed Focus Energy: +" + itemProperty.value + "%";
                break;
            case 9 /* atack */:
                finalText = "Atack: +" + itemProperty.value;
                break;
            case 10 /* defense */:
                finalText = "Defense: +" + itemProperty.value;
                break;
            default:
                break;
        }
        return finalText;
    };
    return cItemsDefinitions;
}());
