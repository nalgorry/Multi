import {cServerMonster} from './cServerMonster';

export class cServerDefinitionMonsters {

    //carga todas las variables del monstruo elegido
    static defineMonsters(monster:cServerMonster,wichMonster:enumMonsters) {

         switch (wichMonster) {
            case enumMonsters.FirstMonster:
                monster.randomPower = 5;
                monster.fixPower = 0;
                monster.monsterLife = 100;
                monster.monsterItemLevelDrop = 0;
                monster.specialAtackPercent = 0;
                monster.agresiveMonster = false;
                monster.experience = 1;
                break;
            case enumMonsters.Dragon:
                monster.randomPower = 25;
                monster.fixPower = 25;
                monster.monsterLife = 250;
                monster.monsterItemLevelDrop = 20;
                monster.specialAtackPercent = 0.2;
                monster.agresiveMonster = true;
                monster.experience = 10;
                break;
            case enumMonsters.Wolf:
                monster.randomPower = 5;
                monster.fixPower = 0;
                monster.monsterLife = 120;
                monster.monsterItemLevelDrop = 4;
                monster.specialAtackPercent = 0.1;
                monster.agresiveMonster = true;
                monster.experience = 2;
                break;
            case enumMonsters.RedWolf:
                monster.randomPower = 20;
                monster.fixPower = 15;
                monster.monsterLife = 150;
                monster.monsterItemLevelDrop = 10;
                monster.specialAtackPercent = 0.5;
                monster.agresiveMonster = true;
                monster.experience = 5;
                break;
            case enumMonsters.Cosmic:
                monster.randomPower = 50;
                monster.fixPower = 50;
                monster.monsterLife = 1000;
                monster.monsterItemLevelDrop = 800;
                monster.specialAtackPercent = 0.2;
                monster.agresiveMonster = false;
                monster.experience = 50;
                break;
            case enumMonsters.DummyTarget:
                monster.randomPower = 0;
                monster.fixPower = 0;
                monster.monsterLife = 10000000;
                monster.monsterItemLevelDrop = 800;
                monster.specialAtackPercent = 0;
                monster.agresiveMonster = false;
                monster.experience = 0;
            break;
            default:
                break;
        }

    }

}


