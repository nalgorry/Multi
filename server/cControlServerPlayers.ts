import {cPlayer} from './cPlayer';
import {cServerControlMonster} from './cServerControlMonster';


export class cServerControlPlayers {

    public arrayPlayers:cPlayer[];
    public controlMonster:cServerControlMonster;

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


        socket.broadcast.emit('new player', 
            {id: idPlayer, x: data.x, y: data.y, name:data.name})

        
        //le mando al nuevo jugador todos los jugadores existentes
        for (var id in this.arrayPlayers) {
            this.arrayPlayers[id].sendPlayerToNewPlayer(socket);    
        }

        // Add new player to the players array
        this.arrayPlayers[idPlayer] = new cPlayer(socket,idPlayer,data.name,data.x,data.y,this.controlMonster)

    }

    public onPlayerDisconected(socket){
        delete this.arrayPlayers[socket.id];       
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

                    player.socket.emit('you hit monster', {idMonster: monster.monsterId, 
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
                                this.controlMonster.createNewMonster(Math.round(Math.random() * 76 + 14),Math.round(Math.random() * 76 + 12),this.randomIntFromInterval(1, 4),true)
                            } else {
                                this.controlMonster.createNewMonster(Math.round(Math.random() * 76 + 14),Math.round(Math.random() * 76 + 12),enumMonsters.Cosmic,true);
                            }
                        }
                    }   
                } else {
                    console.log("monstruo no encontrado");
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

}