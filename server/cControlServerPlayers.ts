import {cPlayer} from './cPlayer';

export class cServerControlPlayers {

    public arrayPlayers:cPlayer[];

    constructor(public socket:SocketIO.Server) {

        this.arrayPlayers = [];

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
        this.arrayPlayers[idPlayer] = new cPlayer(socket,idPlayer,data.name,data.x,data.y)

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


 

}