"use strict";
var cServerDefinitionMonsters = (function () {
    function cServerDefinitionMonsters() {
    }
    //carga todas las variables del monstruo elegido
    cServerDefinitionMonsters.defineMonsters = function (monster, wichMonster) {
        switch (wichMonster) {
            case 1 /* FirstMonster */:
                monster.monsterPower = 10;
                monster.monsterLife = 60;
                break;
            case 2 /* Dragon */:
                monster.monsterPower = 60;
                monster.monsterLife = 200;
                break;
            case 3 /* Wolf */:
                monster.monsterPower = 20;
                monster.monsterLife = 100;
                break;
            case 4 /* RedWolf */:
                monster.monsterPower = 30;
                monster.monsterLife = 150;
                break;
            default:
                break;
        }
    };
    return cServerDefinitionMonsters;
}());
exports.cServerDefinitionMonsters = cServerDefinitionMonsters;
