import {cServerMonster} from './cServerMonster';

export class cServerDefinitionMonsters {

    //carga todas las variables del monstruo elegido
    static defineMonsters(monster:cServerMonster,wichMonster:enumMonsters) {

         switch (wichMonster) {
            case enumMonsters.FirstMonster:
                monster.monsterPower = 10;
                monster.monsterLife = 60;
                break;
            case enumMonsters.Dragon:
                monster.monsterPower = 60;
                monster.monsterLife = 200;
                break;
            case enumMonsters.Wolf:
                monster.monsterPower = 20;
                monster.monsterLife = 100;
                break;
            case enumMonsters.RedWolf:
                monster.monsterPower = 30;
                monster.monsterLife = 150;
                break;
            default:
                break;
        }

    }

}


