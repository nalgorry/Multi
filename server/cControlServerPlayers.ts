import {cPlayer} from './cPlayer';
import {cServerControlMonster} from './cServerControlMonster';


export class cServerControlPlayers {

    public arrayPlayers:cPlayer[];
    public controlMonster:cServerControlMonster;

    public playersOnline:number = 0;

    constructor(public socket:SocketIO.Server, public room:string) {

        this.arrayPlayers = [];

    }

    public movePlayer(socketPlayer:SocketIO.Socket, data) {
         
         // Find player in array
        var movePlayer = this.getPlayerById(socketPlayer.id)

        // Player not found
        if (!movePlayer) {
            console.log('Player not found: ' + socketPlayer.id)
            return
        }

        movePlayer.x = data.x;
        movePlayer.y = data.y;
        movePlayer.dirMov = data.dirMov;

        socketPlayer.broadcast.in(this.room).emit('move player', {id: movePlayer.playerId, x: movePlayer.x, y: movePlayer.y,dirMov: movePlayer.dirMov })
    }

    public chatSend(socketPlayer:SocketIO.Socket,data) {
        socketPlayer.broadcast.in(this.room).emit('Chat Receive', {id: socketPlayer.id, text: data.text});
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

    public onNewPlayerConected(socketPlayer:SocketIO.Socket, data, playerData:cPlayer = null) {

        var idPlayer = socketPlayer.id;
        this.playersOnline += 1;

        socketPlayer.broadcast.in(this.room).emit('new player', 
            {id: idPlayer, name:data.name, startX: data.x * 40, startY:data.y * 40 , playersOnline: this.playersOnline})
        
        //le mando al nuevo jugador todos los jugadores existentes
        for (var id in this.arrayPlayers) {
            this.arrayPlayers[id].sendPlayerToNewPlayer(socketPlayer,this.playersOnline);    
        }

        // Add new player to the players array
        if (playerData == null) {
            this.arrayPlayers[idPlayer] = new cPlayer(socketPlayer, idPlayer, 'Guest', 
                data.x, data.y, this.controlMonster)
        } else { //if the player already exist in other map, lets copy it here 
            this.arrayPlayers[idPlayer] = playerData
        }  
}

    public onPlayerDisconected(socketPlayer:SocketIO.Socket):cPlayer{
        
        var playerData = this.getPlayerById(socketPlayer.id);

        delete this.arrayPlayers[socketPlayer.id];      
        
        this.socket.in(this.room).emit('remove player', {id: socketPlayer.id})
        this.playersOnline -= 1;

        return playerData;
    }

    public youEquipItem(socketPlayer:SocketIO.Socket, data) {
    
        console.log(socketPlayer.id);
         // Find player in array
        var player = this.getPlayerById(socketPlayer.id)

        // Player not found
        if (player == undefined) {
            console.log('Player not found: ' + socketPlayer.id)
            return
        }

        player.equipItems(data);

    }

    public youChange(socketPlayer:SocketIO.Socket, data) {

        //lets see if player changes its name 
        if(data.name != null) {
              var player:cPlayer = this.getPlayerById(socketPlayer.id);

            if (player != null) {
                player.playerName = data.name;
                this.socket.in(this.room).emit('player change', {id: socketPlayer.id, name:data.name})
            }
        }
    }

    public spellCast(socketPlayer:SocketIO.Socket, data) {
        
        data.idPlayer = socketPlayer.id;

        var player = this.getPlayerById(data.idPlayer);

        if (player != null) {

            //calculo el efecto del hechizo, esto me dice que daño hace y a quien afecta
            var spellResult = player.spellResult(data);

            console.log(spellResult.monsterDamage);

            //ataco todos los monstruos afectados por el hechizo
            spellResult.monsterTargets.forEach(idMonster => {

                //busco el moustro y le pego
                var monster = this.controlMonster.getMonsterById(idMonster);

                if (monster != undefined) {

                    monster.monsterHit(data, spellResult.monsterDamage, player.playerId);

                    this.socket.in(this.room).emit('someone hit monster', {
                        idMonster: monster.monsterId, 
                        idPlayer: player.playerId,
                        damage: spellResult.monsterDamage, 
                        idSpell: spellResult.spellAnimationMonster,
                        lifePercRemaining: monster.monsterLife / monster.monsterMaxLife
                    });

                    //controlo si se murio el moustro y lo saco del array de moustros
                    if (monster.monsterDie == true) { 
                        
                        this.socket.in(this.room).emit('monster die', {idMonster: monster.monsterId, 
                                                        idPlayer: player.playerId,
                                                        experience:monster.experience});
                        
                        delete this.controlMonster.arrayMonster[monster.monsterId];

                        //TODO sacar esto de aca... creo un nuevo monster aleatorio, excepto el cosmico que lo creo de nuevo
                        if (monster.monsterRespawn == true) { 
                            if (monster.monsterType != enumMonsters.Cosmic) {
                                this.controlMonster.createNewMonster(
                                    undefined, 
                                    undefined,
                                    this.controlMonster.getRandomMonster(),true)
                            } else {
                                this.controlMonster.createNewMonster(
                                    undefined, 
                                    undefined,
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
                    this.socket.in(this.room).emit('player hit', {id: playerHit.playerId, 
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


    public playerDie(socketPlayer:SocketIO.Socket, data) {        

        var player:cPlayer = this.getPlayerById(socketPlayer.id);

        //primero envio al que mato su kill
        if (player != null) {

            var playerKill:cPlayer = this.getPlayerById(data.idPlayerKill);

            if (playerKill != null) {     //envio al que murio quien lo mato

                this.socket.in(this.room).emit('player die', {id: socketPlayer.id, idPlayerThatKill: playerKill.playerId , name: player.playerName})

            } else { //lo mato un monster, que cagada...

                this.socket.in(this.room).emit('player die', {id: socketPlayer.id, name: 'Monster'})

            }

        }
        
    }
 

}