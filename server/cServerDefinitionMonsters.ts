import {cServerMonster} from './cServerMonster';

export class cServerDefinitionMonsters {

    //carga todas las variables del monstruo elegido
    static defineMonsters(monster:cServerMonster,wichMonster:enumMonsters) {

         switch (wichMonster) {
            case enumMonsters.FirstMonster:
                monster.randomPower = 10;
                monster.fixPower = 10;
                monster.monsterLife = 60;
                monster.monsterItemLevelDrop = 0;
                monster.specialAtackPercent = 0;
                break;
            case enumMonsters.Dragon:
                monster.randomPower = 25;
                monster.fixPower = 25;
                monster.monsterLife = 250;
                monster.monsterItemLevelDrop = 20;
                monster.specialAtackPercent = 0.2;
                break;
            case enumMonsters.Wolf:
                monster.randomPower = 15;
                monster.fixPower = 10;
                monster.monsterLife = 100;
                monster.monsterItemLevelDrop = 4;
                monster.specialAtackPercent = 0.1;
                break;
            case enumMonsters.RedWolf:
                monster.randomPower = 20;
                monster.fixPower = 15;
                monster.monsterLife = 150;
                monster.monsterItemLevelDrop = 10;
                monster.specialAtackPercent = 0.5;
                break;
            case enumMonsters.Cosmic:
                monster.randomPower = 50;
                monster.fixPower = 50;
                monster.monsterLife = 1000;
                monster.monsterItemLevelDrop = 50;
                monster.specialAtackPercent = 0.2;
                break;
            default:
                break;
        }

    }

}


