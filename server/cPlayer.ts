var util = require('util');

export class cPlayer {

    public playerLife:number;
    public dirMov:number;

    public protectedField:boolean = false;
    public weakEfect:boolean = false;

    constructor(public socket:SocketIO.Server ,public playerId:string,public playerName:string, public x:number, public y:number) {
    }

    public sendPlayerToNewPlayer(socket:SocketIO.Server) {
        socket.emit('new player', {id: this.playerId, 
      x: this.x, y: this.y, name:this.playerName})
    }

    public spellActivated(data):number {
        
        //veo que hechizo se activo 
        var damage:number = 0;

        switch (data.idSpell) {
            case enumActiveSpells.FireBall :
            damage = Math.round(Math.random() * 50 + 20);

            break;
            case enumActiveSpells.CriticalBall :
              damage = Math.round(Math.random() * 30 + 15);
              if (Math.random() < 0.15) { //daño critico!
                damage = damage + 50;
              }
            break;
            case enumActiveSpells.ProtectField:
                this.protectedField = true;
                var timer = setTimeout(() => this.protectedField = false, 4500);
                break;

            case enumActiveSpells.WeakBall:
                this.weakEfect = true;
                var timer = setTimeout(() => this.weakEfect = false, 6500);
                break;
        
            default:
                break;
        }

        if (this.protectedField == true) {
            damage = Math.round(damage / 3);
        }

        if (this.weakEfect == true) {
            damage = Math.round(damage * 2);
        }  

        return damage;
    }

    

}

enum enumActiveSpells {
    FireBall = 3,
    CriticalBall = 4,
    WeakBall = 5,
    ProtectField = 6
}