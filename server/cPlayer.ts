var util = require('util');

export class cPlayer {

    public playerLife:number;
    public dirMov:number;
    
    public atack:number = 2;
    public defense:number = 2;

    public protectedField:boolean = false;
    public weakEfect:boolean = false;

    constructor(public socket:SocketIO.Server ,public playerId:string,public playerName:string, public x:number, public y:number) {
    }

    public sendPlayerToNewPlayer(socket:SocketIO.Server) {
        socket.emit('new player', {id: this.playerId, 
      x: this.x, y: this.y, name:this.playerName})
    }

    public calculateDamage(damage:number):number {
    
        if (damage > 0) { //puede ser que este curando
            damage -= this.randomIntFromInterval(this.defense / 2,this.defense);

            if (damage <= 0) {
                damage = 1;
            }
        }

        if (this.protectedField == true) {
            damage = Math.round(damage / 2);
        }

        return damage;
    }

    public spellActivated(data):number {
        
        //veo que hechizo se activo 
        var damage:number = 0;

        switch (data.idSpell) {
            case enumSpells.BasicAtack :
            damage = Math.round(Math.random() * 50 + 20);

            break;
            case enumSpells.CriticalBall :
              damage = Math.round(Math.random() * 30 + 15);
              if (Math.random() < 0.15) { //daño critico!
                damage = damage + 50;
              } 
            break;
            case enumSpells.LightingStorm :
            damage = Math.round(Math.random() * 100 + 50);

            break;
            case enumSpells.ProtectField:
                this.protectedField = true;
                var timer = setTimeout(() => this.protectedField = false, 4500);
                break;

            case enumSpells.WeakBall:
                this.weakEfect = true;
                var timer = setTimeout(() => this.weakEfect = false, 6500);
                break;

            case enumSpells.HealHand:
                damage = -Math.round(Math.random() * 40 + 40);
                break;
        
            default:
                break;
        }

        if (this.protectedField == true) {
            damage = Math.round(damage / 2);
        }

        if (this.weakEfect == true) {
            damage = Math.round(damage * 2);
        }  

        damage += this.randomIntFromInterval(this.atack / 2, this.atack);

        return damage;
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

}

