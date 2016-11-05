import {cPlayer} from './cPlayer';

export class cServerControlPlayers {

    private arrayPlayers:cPlayer[];

    constructor(public socket:SocketIO.Server) {

    }

    public getPlayerById(id:string) {
        return this.arrayPlayers[id];
    }

 

}