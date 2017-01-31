import {cServerControlPlayers} from './cControlServerPlayers';
import {cPlayer} from './cPlayer';
import {cServerDefinitionMonsters} from './cServerDefinitionMonsters';
import {cServerControlItems} from './items/cServerControlItems';


export class cServerMonster {

    public monsterDie:boolean = false; //para chekear si el moustro se murio o no
    public monsterLife:number;
    public tileX:number; 
    public tileY:number;
    public randomPower:number;
    public fixPower:number;
    public monsterId:string;
    public socket:SocketIO.Server;
    public controlPlayer:cServerControlPlayers;
    public monsterType: enumMonsters; 
    public specialAtackPercent:number = 0 //porcentaje de que lance el hechizo especial

    public monsterItemLevelDrop:number;

    //variables para definir el ataque
    public gridSize:number = 40;
    public monsterAtackTilesX:number = 13;
    public monsterAtackTilesY:number = 9;
    
    constructor(public controlItems:cServerControlItems) {

    }

    public startMonster(
                monsterId:string,
                monsterType:enumMonsters,
                socket:SocketIO.Server,
                controlPlayer:cServerControlPlayers,
                tileX:number,tileY:number) {

        this.monsterId = monsterId;

        this.socket = socket;
        this.controlPlayer = controlPlayer;
        this.tileX = tileX;
        this.tileY = tileY;
        
        //valores que dependen del tipo de monstruo
        this.monsterType = monsterType;

        cServerDefinitionMonsters.defineMonsters(this,monsterType)

        this.emitNewMonster()
    
         var timerAtack = setTimeout(() => this.monsterAtack(), 1200);
         var timerMove = setTimeout(() => this.monsterMove(), 800);

    }

    private emitNewMonster(socket:SocketIO.Server = null) {
        //emito el monstruo, si viene un socket es porque es un jugador nuevo y le mando solo a el los monstruos que ya existen
        var monsterdata =  {id:this.monsterId,tileX:this.tileX, tileY:this.tileY,monsterType:this.monsterType};

        if (socket == null) {
            this.socket.emit('new Monster',monsterdata);
        }
        else {
            socket.emit('new Monster', monsterdata);
        }

    }

    public monsterMove() {

        var playerNear:cPlayer = undefined;

        //controlo si hay algun jugador cerca del monstruo
        for (var idPlayer in this.controlPlayer.arrayPlayers) {

            var player = this.controlPlayer.arrayPlayers[idPlayer]

            var playerTileX = Math.round(player.x / this.gridSize);
            var playerTileY = Math.round(player.y / this.gridSize);
            var data;

            if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
                Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
                    
                    playerNear = player;

            }

        }

        if (playerNear != undefined) {
            //sigo al player detectado
            var playerTileX = Math.round(playerNear.x / this.gridSize);
            var playerTileY = Math.round(playerNear.y / this.gridSize);
            var monsterMove:boolean = false;

            if (this.tileX > playerTileX + 1) {
                this.tileX -= 1
                monsterMove = true;
            } else if (this.tileX < playerTileX - 1) {
                this.tileX += 1
                monsterMove = true;
            }

            if (this.tileY > playerTileY + 1) {
                this.tileY -= 1
                monsterMove = true;
            } else if (this.tileY < playerTileY - 1) {
                this.tileY += 1
                monsterMove = true;
            }

            if (monsterMove) {
                this.socket.emit('monster move', {idMonster:this.monsterId, tileX: this.tileX, tileY: this.tileY })
            }
            
        }

        if (this.monsterDie == false) {
            var timerMove = setTimeout(() => this.monsterMove(), 800);
        }

    }

    public monsterHit(data,player:cPlayer) {

        var damage = player.spellActivated(data);
        player.socket.emit('you hit monster', {idMonster:this.monsterId, damage: damage,idSpell:data.idSpell})

        this.monsterLife -= damage;

        //controlo si se murio el moustro 
        if (this.monsterLife <= 0) {
            this.socket.emit('monster die', {idMonster: this.monsterId, idPlayer:player.playerId});
            this.monsterDie = true;

            //creo un item para que tire el monstruo
            var itemType = this.randomIntFromInterval(0,21); //TODO tengo que ver donde va a quedar esto
            this.controlItems.createNewItem(itemType, this.monsterItemLevelDrop, this.tileX, this.tileY);

        } 
   
    }

    private monsterAtack() {

        if (this.monsterDie == false) {

            //controlo que jugador esta demasiado cerca de un moustro
            for (var idPlayer in this.controlPlayer.arrayPlayers) {

                var player = this.controlPlayer.arrayPlayers[idPlayer]

                var playerTileX = Math.round(player.x / this.gridSize);
                var playerTileY = Math.round(player.y / this.gridSize);
                var data;

                if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
                    Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {
                
                var randomAtack = Math.random();

                if (randomAtack >= this.specialAtackPercent) {
                    //normal atack 
                    data = {
                            idMonster:this.monsterId,
                            idPlayer: player.playerId,
                            monsterAtackType: 0,
                            damage: player.calculateDamage(Math.round(Math.random()*this.randomPower+1) + this.fixPower),
                            idSpell: enumSpells.BasicAtack,
                        }
                } else {
                    //especial mega atack!!
                    data = {
                            idMonster: this.monsterId,
                            idPlayer: player.playerId,
                            monsterAtackType: 1,
                            damage: player.calculateDamage(50),
                            tileX: playerTileX,
                            tileY: playerTileY,
                            spellSize: 150,
                            coolDownTimeSec: 1,
                            idSpell: enumSpells.BasicAtack,
                        }
                }

                this.socket.emit('monster hit', data );         

                }

            }
        
        
            var timerAtack = setTimeout(() => this.monsterAtack(), 1200);
        }
    }

    public sendMonsterToNewPlayer(socket:SocketIO.Server) {
        this.emitNewMonster(socket);
    }

    private randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

}

