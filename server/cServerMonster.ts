import {cServerControlPlayers} from './cControlServerPlayers';
import {cPlayer} from './cPlayer';


export class cServerMonster {

    public monsterDie:boolean = false; //para chekear si el moustro se murio o no
    public monsterLife:number;
    public tileX:number; 
    public tileY:number;
    public monsterPower:number;

    //variables para definir el ataque
    public gridSize:number = 40;
    public monsterAtackTilesX:number = 13;
    public monsterAtackTilesY:number = 9;
    
    constructor(public monsterId:string,
                public socket:SocketIO.Server,
                public controlPlayer:cServerControlPlayers ) {

    }

    public startMonster(tileX:number,tileY:number,monsterLife:number,monsterPower:number) {

        this.monsterLife = monsterLife;
        this.tileX = tileX;
        this.tileY = tileY;
        this.monsterPower = monsterPower;

        console.log({id:this.monsterId,tileX:this.tileX, tileY:this.tileY})

        this.socket.emit('new Monster', {id:this.monsterId,tileX:this.tileX, tileY:this.tileY});

         var timer = setTimeout(() => this.monsterAtack(), 650);

    }

    public monsterHit(data,player:cPlayer) {

        var damage = player.spellActivated(data);
        player.socket.emit('you hit monster', {idMonster:this.monsterId, damage: damage,idSpell:data.idSpell})

        this.monsterLife -= damage;

        //controlo si se murio el moustro 
        if (this.monsterLife <= 0) {
            this.socket.emit('monster die', {idMonster: this.monsterId, idPlayer:player.playerId});
            this.monsterDie = true;
        } 
   
    }

    private monsterAtack() {

        //controlo que jugador esta demasiado cerca de un moustro
        for (var idPlayer in this.controlPlayer.arrayPlayers) {

            var player = this.controlPlayer.arrayPlayers[idPlayer]

            var playerTileX = Math.round(player.x / this.gridSize);
            var playerTileY = Math.round(player.y / this.gridSize);
            var data;

            if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
                Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
             
            var randomAtack = Math.random();

            if (randomAtack <= 0.8) {
                //normal atack 
                data = {
                        idMonster:this.monsterId,
                        idPlayer:player.playerId,
                        monsterAtackType: 0,
                        damage:player.calculateDamage(Math.round(Math.random()*this.monsterPower+1)),
                        idSpell:3,
                    }
            } else {
                //especial mega atack!!
                data = {
                        idMonster:this.monsterId,
                        idPlayer:player.playerId,
                        monsterAtackType: 1,
                        damage: player.calculateDamage(50),
                        tileX: playerTileX,
                        tileY:playerTileY,
                        spellSize: 150,
                        coolDownTimeSec: 1,
                        idSpell: 3,
                    }
            }

                this.socket.emit('monster hit',data );         

            }

        }
        
        if (this.monsterDie == false) {
            var timer = setTimeout(() => this.monsterAtack(), 650);
        }
    }

    public sendMonsterToNewPlayer(socket:SocketIO.Server) {
        socket.emit('new Monster', {id:this.monsterId,tileX:this.tileX, tileY:this.tileY});
    }

}