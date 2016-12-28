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
    return cItemsDefinitions;
}());
