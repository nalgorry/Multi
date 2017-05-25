var util = require('util');
import {cServerControlMonster} from './cServerControlMonster';


export class cPlayer {

    private gridSize:number = 40;
    public playerLife:number;
    public dirMov:number;
    
    public atack:number = 2;
    public defense:number = 2;
    public playerLevel:number =1;
    
    //this will change acording of the map of the playerDamage
    public room:string = "principalMap";

    public protectedField:boolean = false;
    public weakEfect:boolean = false;

    constructor(public socket:SocketIO.Server ,
        public playerId:string,
        public playerName:string, 
        public x:number, 
        public y:number,
        public controlMonster:cServerControlMonster) {
    }

    public sendPlayerToNewPlayer(socket:SocketIO.Server, playersOnline) {
        socket.emit('new player', {id: this.playerId, 
      x: this.x, y: this.y, name:this.playerName, playersOnline: playersOnline})
    }

    public calculateDamage(damage:number):number {
    
        if (damage > 0) { //puede ser que este curando
            damage -= this.randomIntFromInterval(this.defense / 2,this.defense);

            if (damage <= 0) {
                damage = 1;
            }
            
            //me fijo si tiene el escudo protector
            if (this.protectedField == true) {
                damage = Math.round(damage / 2);
            }

            //me fijo si tiene el efecto de daño incrementado
            if (this.weakEfect == true) {
                damage = Math.round(damage * 2);
            }  

        } 

        return damage;
    }

    public spellResult(data):cSpellResult {

       
        //aca va los resultados de activar el hechizo
        var resultado = new cSpellResult

        //seteo las animaciones por defecto
        resultado.spellAnimationPlayer = data.idSpell;
        resultado.spellAnimationMonster = data.idSpell;

        //veo que hechizo se activo 
        var damage:number = 0;

        //defino los tarjets normales de los hechizos
        if (data.idMonster != undefined) {
            resultado.monsterTargets.push(data.idMonster);
        }

        if (data.idPlayerHit != undefined) {
            resultado.playerTargets.push(data.idPlayerHit);
        }

        //analiso que hechizo se lanzo y calculo sus efectos
        switch (data.idSpell) {
            case enumSpells.BasicAtack :
                damage = Math.round(Math.random() * 50 + 20);

                resultado.monsterDamage = damage;
                resultado.playerDamage = damage;

                break;

            case enumSpells.CriticalBall :
                damage = Math.round(Math.random() * 30 + 15);
                if (Math.random() < 0.15) { //daño critico!
                    damage = damage + 50;
                } 

                resultado.monsterDamage = damage;
                resultado.playerDamage = damage;

                break;
            case enumSpells.LightingStorm :
                damage = Math.round(Math.random() * 100 + 50);

                resultado.monsterDamage = damage;
                resultado.playerDamage = damage;

                break;
            case enumSpells.ProtectField:
                resultado.playerDamage = 0;
                this.protectedField = true;
                var timer = setTimeout(() => this.protectedField = false, 4500);
                break;
            case enumSpells.WeakBall:
                this.weakEfect = true;
                var timer = setTimeout(() => this.weakEfect = false, 6500);
                break;
            case enumSpells.HealHand:
                resultado.playerDamage = -Math.round(Math.random() * 40 + 40);
                break;
            case enumSpells.SelfExplosion:
                resultado.monsterDamage = Math.round(Math.random() * 50 + 50);
                resultado.playerDamage = 0;

                var playerTileX = Math.round(this.x / this.gridSize);
                var playerTileY = Math.round(this.y / this.gridSize);

                resultado.playerTargets = [this.playerId];
                resultado.monsterTargets = 
                    this.controlMonster.findMonstersInArea(playerTileX , playerTileY , 5, 5);
                resultado.spellAnimationMonster = enumSpells.BasicAtack; 
            default:
                break;
        }

        if ( damage > 0  ) { //me fijo si es un hechizo de daño y sumo el daño extra por el ataque del jugador
            resultado.playerDamage += this.randomIntFromInterval(this.atack / 2, this.atack);
            resultado.monsterDamage += this.randomIntFromInterval(this.atack / 2, this.atack);
        }
        
        return resultado;
    }

    private randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    public equipItems(data) {

        //actualizo el ataque y la defensa del player
        if (data.itemsEfects[enumItemEfects.atack] != undefined)  {
            this.atack = data.itemsEfects[enumItemEfects.atack].value;
        } 
        if (data.itemsEfects[enumItemEfects.defense] != undefined)  {
            this.defense = data.itemsEfects[enumItemEfects.defense].value;
        }

    }


    public levelUp(data) {
        this.playerLevel = data.playerLevel;   
    }

}

class cSpellResult {
    public monsterDamage:number;
    public playerDamage:number;
    public monsterTargets:string[] = [];
    public playerTargets:string[] = [];
    public spellAnimationMonster:enumSpells;
    public spellAnimationPlayer:enumSpells;

}