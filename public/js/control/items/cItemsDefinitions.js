var cItemsDefinitions = (function () {
    function cItemsDefinitions() {
    }
    cItemsDefinitions.defineItem = function (item) {
        switch (item.itemType) {
            case 1 /* smallDager */:
                item.itemEquipType = 1 /* weapon */;
                break;
            case 2 /* dager */:
                item.itemEquipType = 1 /* weapon */;
                break;
            case 3 /* sword */:
                item.itemEquipType = 1 /* weapon */;
                break;
            default:
                break;
        }
    };
    return cItemsDefinitions;
}());
