const createBoard = require('./functions/board.js');
const makeMove = require('./functions/makeMove.js');
const gameEndCheck = require('./functions/gameEndCheck.js');
const http = require('http');

class Game {
    constructor(newID) {
        this.createBoard = createBoard;
        this.makeMove = makeMove;
        this.board = this.createBoard();
        this.whiteTurn = true;
        this.enPassantSquare = null;
        this.canCastle = [true, true, true, true]; //maybe change this to be indexes
        this.lastMove = [null, null];
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
        if (client.userData.color == 0) {
            this.playerData.whitePlayer = client;
            this.playerData.blackPlayer = { 'userData': { 'color': 1, 'name': 'SkibBot' } }
        } else {
            this.playerData.blackPlayer = client;
            this.playerData.whitePlayer = { 'userData': { 'color': 0, 'name': 'SkibBot' } }
        }
        //console.log('here')
        client.send(JSON.stringify({ "board": this.board, "whiteTurn": this.whiteTurn, "endString": "", "updateSquares": [], "recentMove": this.lastMove, "captures": this.captures, 'playerData': { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name } }));
    }

    move = (request, client, botMove) => {
        //console.log(request)
        //if (this.whiteTurn === (client.userData.color == 0)) {
        if (this.whiteTurn == (client.userData.color == 0)
            || botMove) {
            console.log('here')
            console.log(request.body)
            let moveResult = this.makeMove(request.body, this.board, this.whiteTurn, this.enPassantSquare, this.canCastle);
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

                //game end check
                let endString = gameEndCheck(this.board, this.whiteTurn, this.enPassantSquare, this.canCastle)
                client.send(JSON.stringify({ "board": this.board, "whiteTurn": this.whiteTurn, "endString": endString, "updateSquares": moveResult.updateSquares, "recentMove": this.lastMove, "captures": this.captures }));

                if (this.whiteTurn != client.userData.color == 0) {
                    this.#sendGame(this.board, this.whiteTurn, this.enPassantSquare, this.canCastle).then(res => {
                        console.log(res);
                        res = JSON.parse(res);
                        this.move({ 'body': { 'moveFrom': res[0], 'moveTo': res[1] } }, client, true);
                    });
                }

            }
        }

    }

    reset = (client) => {

        this.board = this.createBoard();
        this.whiteTurn = true;
        this.enPassantSquare = null;
        this.canCastle = [true, true, true, true]; //maybe change this to be indexes
        this.lastMove = [null, null];
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
        client.send(JSON.stringify({ "board": this.board, "whiteTurn": this.whiteTurn, "endString": "", "updateSquares": [], "recentMove": this.lastMove, "captures": this.captures }));
        //client.send(JSON.stringify({ "board": 'test' }));
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

    #sendGame(board, whiteTurn, enPassantSquare, canCastle) {
        return new Promise((resolve, reject) => {
            let data = JSON.stringify(
                {
                    'board': board,
                    'whiteTurn': whiteTurn,
                    'enPassantSquare': enPassantSquare,
                    'canCastle': canCastle
                }
            );
            const options = {
                hostname: 'localhost',
                port: 8081,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }


            const req = http.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)

                let move = "";
                res.on('data', d => {
                    move += d;
                });

                res.on('end', d => {
                    resolve(move);
                })
            })

            req.on('error', error => {
                reject(error);
            })

            req.write(data)
            req.end()
        });

    }

}

module.exports = Game;