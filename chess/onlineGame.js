const createBoard = require('./functions/board.js');
const makeMove = require('./functions/makeMove.js');
const gameEndCheck = require('./functions/gameEndCheck.js');

class Game {
    constructor(newID) {
        this.createBoard = createBoard;
        this.makeMove = makeMove;
        this.board = this.createBoard();
        this.whiteTurn = true;
        this.enPassantSquare = null;
        this.canCastle = [true, true, true, true]; //maybe change this to be indexes
        this.lastMove = [null, null];
        this.endString = "";
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


    create = (client) => {
        client.send(JSON.stringify({ 'type': "LOGIN", 'playerData': { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name } }));
    }


    move = (request, wss, client) => {

        if (this.whiteTurn == (client.userData.color == 0)) {
            let moveResult = this.makeMove(request.body, this.board, this.whiteTurn, this.enPassantSquare, this.canCastle);

            //update captures object
            if (moveResult) {
                if (moveResult.piece) {
                    this.captures[this.whiteTurn ? "black" : "white"][this.#getPieceType(moveResult.piece)]++;
                    //console.log(this.captures)
                }
                if (this.lastMove[0])
                    moveResult.updateSquares = moveResult.updateSquares.concat(this.lastMove);
                this.lastMove = [request.body.moveFrom, request.body.moveTo];

                //console.log(moveResult.wasEnPassant)
                if (moveResult.wasEnPassant) {
                    this.board[moveResult.wasEnPassant] = 0;
                }

                if (moveResult.wasCastle) {
                    this.board[moveResult.wasCastle[0]] = this.board[moveResult.wasCastle[1]]
                    this.board[moveResult.wasCastle[1]] = 0;
                    moveResult.updateSquares = moveResult.updateSquares.concat(moveResult.wasCastle);
                }

                this.whiteTurn = !this.whiteTurn;
                this.enPassantSquare = moveResult.enPassantSquare;

                this.board[request.body.moveTo] = this.board[request.body.moveFrom];
                this.board[request.body.moveFrom] = 0;

                if (this.board[request.body.moveTo] % 10 == 1){
                    if (request.body.moveTo < 8 || request.body.moveTo > 55){
                        this.board[request.body.moveTo] = this.board[request.body.moveTo] + 4;
                    }
                }
                //game end check
                this.endString = gameEndCheck(this.board, this.whiteTurn, this.enPassantSquare, this.canCastle)


                wss.clients.forEach(client_ => {
                    if (client_.userData.gameID == this.gameID) {
                        //console.log(client.userData.name)
                        client_.send(JSON.stringify({ "board": this.board, "whiteTurn": this.whiteTurn, "endString": this.endString, "updateSquares": moveResult.updateSquares, "recentMove": this.lastMove, "captures": this.captures }));
                    }
                });

            }
        }
    }


    reset = (wss, client) => {
        this.board = this.createBoard();
        this.whiteTurn = true;
        this.enPassantSquare = null;
        this.canCastle = [true, true, true, true];
        this.lastMove = [null, null];
        this.endString = "";
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

        wss.clients.forEach(client_ => {
            if (client_.userData.gameID == this.gameID) {
                client_.send(JSON.stringify({ "board": this.board, "whiteTurn": this.whiteTurn, "endString": "", "updateSquares": [], "recentMove": this.lastMove, "captures": this.captures }));
            }
        });
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
            client.send(JSON.stringify({ "board": this.board, "whiteTurn": this.whiteTurn, "endString": this.endString, "updateSquares": [], "recentMove": this.lastMove, "captures": this.captures, 'playerData': { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name }}));
        } else {
            wss.clients.forEach(client_ => {
                if (client_.userData?.gameID == this.gameID) {
                    client_.send(JSON.stringify({ "board": this.board, "whiteTurn": this.whiteTurn, "endString": this.endString, "updateSquares": [], "recentMove": this.lastMove, "captures": this.captures, 'playerData': { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name }}));                    
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
                client_.send(JSON.stringify({ "board": this.board, "whiteTurn": this.whiteTurn, "endString": "", "updateSquares": [], "recentMove": this.lastMove, "captures": this.captures, 'playerData': { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name } }));

            }
        });
    }

    
    #getPieceType = (piece) => {
        switch (piece % 10) {
            case 1:
                return "Pawn";
                break;
            case 2:
                return "Knight";
                break;
            case 3:
                return "Bishop";
                break;
            case 4:
                return "Rook";
                break;
            case 5:
                return "Queen";
                break;

        }
    }


}

module.exports = Game;