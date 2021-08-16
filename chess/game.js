const makeMove = require('./makeMove.js');
const createBoard = require('./board.js');

class Game {
    constructor(newID) {
        this.createBoard = createBoard;
        this.makeMove = makeMove;
        this.board = this.createBoard();
        this.whiteTurn = true;
        this.enPassantSquare = [];
        this.result = undefined;
        this.canCastle = [true, true, true, true];
        this.lastMove = [];
        this.captures = {
            white: {
                Pawn: 0,
                Knight: 0,
                Bishop: 0,
                Rook: 0,
                Queen: 0
            },
            black: {
                Pawn: 0,
                Knight: 0,
                Bishop: 0,
                Rook: 0,
                Queen: 0
            }
        }
        this.playerData = {
            whitePlayer: undefined,
            blackPlayer: undefined
        }
        this.gameID = newID;
    }


    /*
        //board = this.createBoard();
        whiteTurn = true;
        enPassantSquare = [];
        //the result variable is written to after a move is made, format is found in makeMove.js
        result;
        //order is BR, BL, TR, TL
        canCastle = 
        captures = 
    */


    //when sending data to front end, data should be formatted as:
    //[board, whiteTurn, endString, updateSquares, captures, recentMove, loginInfo]
    //endString comes from the result of makeMove and is result[1]
    //updateSquares comes from the result of makeMove and is result[2]
    //captures is the captures object in this file which stores the pieces captured by both players


    //i am sorry i was tired
    //was trying to make lobbies work
    //color choice not hiding taken colors, weird stuff with bored drawing also
    //walk through intro again
    main = (request, wss, client) => {
        //console.log(request.type)
        let body = request.body;
        switch (request.messageType) {
            case 0:
                //client["userData"] = {'type': request.body.type, 'name': request.body.name, 'color': undefined, 'id': userIDNum++ };
                if (request.body.gameType == 1) {
                    console.log(this.playerData)
                    client.send(JSON.stringify(["LOGIN", { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name }]));
                } else {
                    client.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures]));
                }
                //console.log(userData)
                //console.log({ whitePlayer: userData.whitePlayer?.userData?.name, blackPlayer: userData.blackPlayer?.userData?.name})

                break;
            case 1:
                //console.log(body)
                //console.log('here')
                //console.log(client.userData.type)


                if (
                    (this.whiteTurn && client.userData.color == 0 ||
                        (!this.whiteTurn && client.userData.color) == 1 ||
                        (client.userData.gameType === 0))) {

                    this.result = this.makeMove(body, this.board, this.whiteTurn, this.enPassantSquare, this.canCastle);

                    //update captures object
                    if (this.result[0]) {
                        if (this.result[3]) {
                            this.captures[this.whiteTurn ? 'white' : 'black'][this.result[3]]++;
                        }

                        if (this.lastMove.length){
                        this.result[2].push(this.lastMove[0], this.lastMove[1]);
                        }

                        this.lastMove = this.result[4];

                        this.whiteTurn = !this.whiteTurn;
                        this.enPassantSquare = this.result[0];
                        if (client.userData.gameType == 0) {
                            client.send(JSON.stringify([this.board, this.whiteTurn, this.result[1], this.result[2], this.captures,this.lastMove]));
                        } else {
                            wss.clients.forEach(client_ => {
                                if (client_.userData.gameID == this.gameID) {
                                    //console.log(client.userData.name)
                                   client_.send(JSON.stringify([this.board, this.whiteTurn, this.result[1], this.result[2], this.captures, this.lastMove]));
                                }
                            });
                        }
                    }
                }
                break;
            case 2:
                this.board = this.createBoard();
                this.whiteTurn = true;
                this.enPassantSquare = [];
                this.canCastle = [true, true, true, true];
                this.results = undefined;
                this.lastMove = [];
                this.captures = {
                    white: {
                        Pawn: 0,
                        Knight: 0,
                        Bishop: 0,
                        Rook: 0,
                        Queen: 0
                    },
                    black: {
                        Pawn: 0,
                        Knight: 0,
                        Bishop: 0,
                        Rook: 0,
                        Queen: 0
                    }
                }
                if (client.userData.gameType == 0) {
                    client.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures, this.lastMove]));
                } else {
                    wss.clients.forEach(client_ => {
                        if (client_.userData.gameID == this.gameID) {
                            client_.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures, this.lastMove]));
                        }
                    });
                }
                break;
            case 3:
                client.userData.name = request.body.name;
                if (this.playerData.whitePlayer == undefined && request.body.color === 0) {
                    client.userData.color = 0;
                    this.playerData.whitePlayer = client;
                }
                if (this.playerData.blackPlayer == undefined && request.body.color === 1) {
                    client.userData.color = 1;
                    this.playerData.blackPlayer = client;
                }
                if (client.userData.color == undefined || request.body.color == 2) {
                    client.userData.color = 2;
                }
                //console.log(this.playerData)
                if (client.userData.color == 2) {
                    client.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures, this.lastMove, { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name }]));
                } else {
                    wss.clients.forEach(client_ => {
                        if (client_.userData?.gameID == this.gameID) {
                            client_.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures, this.lastMove, { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name }]));
                        }
                    });
                }
        }
    }

}
module.exports = Game;