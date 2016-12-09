"use strict";
var cServerDefinitionMonsters = (function () {
    function cServerDefinitionMonsters() {
    }
    //carga todas las variables del monstruo elegido
    cServerDefinitionMonsters.defineMonsters = function (monster, wichMonster) {
        console.log("entra");
        switch (wichMonster) {
            case 1 /* FirstMonster */:
                monster.monsterPower = 10;
                monster.monsterLife = 60;
                break;
            case 2 /* Dragon */:
                monster.monsterPower = 50;
                monster.monsterLife = 200;
                break;
            default:
                break;
        }
    };
    return cServerDefinitionMonsters;
}());
exports.cServerDefinitionMonsters = cServerDefinitionMonsters;
