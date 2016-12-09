import {cServerMonster} from './cServerMonster';

export class cServerDefinitionMonsters {

    //carga todas las variables del monstruo elegido
    static defineMonsters(monster:cServerMonster,wichMonster:enumMonsters) {

        console.log("entra")

        switch (wichMonster) {
            case enumMonsters.FirstMonster:
                monster.monsterPower = 10;
                monster.monsterLife = 60;
                break;
            case enumMonsters.Dragon:
                monster.monsterPower = 50;
                monster.monsterLife = 200;
                break;
            default:
                break;
        }

    }

}


