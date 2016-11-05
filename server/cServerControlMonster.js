"use strict";
var cServerMonster_1 = require('./cServerMonster');
var cServerControlMonster = (function () {
    function cServerControlMonster(socket) {
        this.socket = socket;
        this.nextIdMonster = 0;
        this.arrayMonster = [];
        var newMonster = new cServerMonster_1.cServerMonster("m" + this.nextIdMonster, this.socket);
        newMonster.startMonster(50, 30, 30);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;
        this.nextIdMonster += 1;
        var newMonster = new cServerMonster_1.cServerMonster("m" + this.nextIdMonster, this.socket);
        newMonster.startMonster(50, 10, 10);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;
        this.nextIdMonster += 1;
    }
    cServerControlMonster.prototype.onNewPlayerConected = function (socket) {
        for (var monster in this.arrayMonster) {
            this.arrayMonster[monster].sendMonsterToNewPlayer(socket);
        }
    };
    return cServerControlMonster;
}());
exports.cServerControlMonster = cServerControlMonster;
