import {cPlayer} from './cPlayer';
import {cServerControlMonster} from './cServerControlMonster';


export class cServerControlPlayers {

    public arrayPlayers:cPlayer[];
    public controlMonster:cServerControlMonster;

    public startTileX:number = 41;
    public startTileY:number = 63;

    public playersOnline:number = 0;

    constructor(public socket:SocketIO.Server) {

        this.arrayPlayers = [];

    }

    public levelUp(socket:any, data) {
        // Find player in array
        var player = this.getPlayerById(socket.id)

        // Player not found
        if (player == undefined) {
            console.log('Player not found: ' + socket.id)
            return
        }

        player.levelUp(data);
    }

    public getPlayerById(id:string):cPlayer {
        return this.arrayPlayers[id];
    }

    public onNewPlayerConected(socket, idPlayer:string, data) {

        this.playersOnline += 1;

        socket.broadcast.emit('new player', 
            {id: idPlayer, name:data.name, startTileX: this.startTileX, startTileY:this.startTileY, playersOnline: this.playersOnline})
        
        //le mando al nuevo jugador todos los jugadores existentes
        for (var id in this.arrayPlayers) {
            this.arrayPlayers[id].sendPlayerToNewPlayer(socket,this.playersOnline);    
        }

        // Add new player to the players array
        this.arrayPlayers[idPlayer] = new cPlayer(socket,idPlayer,data.name,data.x,data.y,this.controlMonster)

    }

    public onPlayerDisconected(socket){
        delete this.arrayPlayers[socket.id];       
        
        this.playersOnline -= 1;
    }

    public youEquipItem(socket:any, data) {
    
         // Find player in array
        var player = this.getPlayerById(socket.id)

        // Player not found
        if (player == undefined) {
            console.log('Player not found: ' + socket.id)
            return
        }

        player.equipItems(data);

    }

    public spellCast(data) {

        var player = this.getPlayerById(data.idPlayer);

        if (player != null) {

            //calculo el efecto del hechizo, esto me dice que daño hace y a quien afecta
            var spellResult = player.spellResult(data);

            //ataco todos los monstruos afectados por el hechizo
            spellResult.monsterTargets.forEach(idMonster => {

                //busco el moustro y le pego
                var monster = this.controlMonster.getMonsterById(idMonster);

                if (monster != undefined) {

                    monster.monsterHit(data, spellResult.monsterDamage, player.playerId);

                    this.socket.emit('someone hit monster', {
                        idMonster: monster.monsterId, 
                        idPlayer: player.playerId,
                        damage: spellResult.monsterDamage, 
                        idSpell: spellResult.spellAnimationMonster
                    });

                    //controlo si se murio el moustro y lo saco del array de moustros
                    if (monster.monsterDie == true) { 
                        
                        this.socket.emit('monster die', {idMonster: monster.monsterId, 
                                                        idPlayer: player.playerId,
                                                        experience:monster.experience});
                        
                        delete this.controlMonster.arrayMonster[monster.monsterId];

                        //TODO sacar esto de aca... creo un nuevo monster aleatorio, excepto el cosmico que lo creo de nuevo
                        if (monster.monsterRespawn == true) { 
                            if (monster.monsterType != enumMonsters.Cosmic) {
                                this.controlMonster.createNewMonster(
                                    Math.round(Math.random() * this.controlMonster.monsterMaxX), 
                                    Math.round(Math.random() * this.controlMonster.monsterMaxY),
                                    this.randomIntFromInterval(1, 4),true)
                            } else {
                                this.controlMonster.createNewMonster(
                                    Math.round(Math.random() * this.controlMonster.monsterMaxX), 
                                    Math.round(Math.random() * this.controlMonster.monsterMaxY),
                                    enumMonsters.Cosmic,true);
                            }
                        }
                    }   
                } else {
                    console.log("monstruo no encontrado: " + idMonster);
                }

            })

            //analizo todos los otros jugadores afectados 
            spellResult.playerTargets.forEach(idPlayer => {

                var playerHit:cPlayer = this.getPlayerById(idPlayer);
                
                if (playerHit != null) {

                    var damage = playerHit.calculateDamage(spellResult.playerDamage); //calculo el daño restando la defensa y demas 
                    
                    // mando el golpe a los jugadores
                    this.socket.emit('player hit', {id: playerHit.playerId, 
                                                    playerThatHit:player.playerId, 
                                                    x: player.x, 
                                                    y: player.y, 
                                                    damage:damage, 
                                                    idSpell: spellResult.spellAnimationPlayer});
                    //player.socket.emit('you hit', {id: playerHit.playerId,damage: damage,idSpell: data.idSpell});

                }

            })

        } else {
            console.log("usuario no entrado");
        }
        
    }

    private randomIntFromInterval(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    } 


    public playerDie(socket, data) {        

        var player:cPlayer = this.getPlayerById(socket.id);

        //primero envio al que mato su kill
        if (player != null) {

            var playerKill:cPlayer = this.getPlayerById(data.idPlayerKill);

            if (playerKill != null) {     //envio al que murio quien lo mato

                this.socket.emit('player die', {id: socket.id, idPlayerThatKill: playerKill.playerId , name: player.playerName, tileX:this.startTileX, tileY: this.startTileY})

            } else { //lo mato un monster, que cagada...

                this.socket.emit('player die', {id: socket.id, name: 'Monster', tileX:this.startTileX, tileY: this.startTileY})

            }

        }
        
    }
 

}