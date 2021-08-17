const makeMove = require('./makeMove.js');
const createBoard = require('./functions/board.js');

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

    //when sending data to front end, data should be formatted as:
    //[board, whiteTurn, endString, updateSquares, captures, recentMove, loginInfo]
    //endString comes from the result of makeMove and is result[1]
    //updateSquares comes from the result of makeMove and is result[2]
    //captures is the captures object in this file which stores the pieces captured by both players

    create = (client) => {
        client.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures]));
   }
    

    move = (wss, client) => {
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

                if (this.lastMove.length) {
                    this.result[2].push(this.lastMove[0], this.lastMove[1]);
                }

                this.lastMove = this.result[4];

                this.whiteTurn = !this.whiteTurn;
                this.enPassantSquare = this.result[0];
                if (client.userData.gameType == 0) {
                    client.send(JSON.stringify([this.board, this.whiteTurn, this.result[1], this.result[2], this.captures, this.lastMove]));
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
    }


    reset = (wss, client) => {
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
    }
    
    login = (request, wss, client) => {
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

    reloadBoard = (wss, color) => {
        wss.clients.forEach(client_ => {
            if (client_.userData.gameID == this.gameID && client_.userData.color !== color) {
                //console.log(client.userData.name)
                console.log('here')
                console.log(this.playerData)
                client_.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures, this.lastMove, { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name }]));
            }
        });
    }

    getGameState = () => {
        return {
            board: this.board,
            castling: this.canCastle,
            enPassasnt: this.enPassantSquare,
            whiteTurn: this.whiteTurn
        }
    }
}

module.exports = Game;