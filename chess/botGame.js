const makeMove = require('./functions/makeMove.js');
const createBoard = require('./functions/board.js');
const http = require('http');

class Game {
    constructor(newID) {
        this.createBoard = createBoard;
        this.makeMove = makeMove;
        this.board = this.createBoard();
        this.whiteTurn = true;
        this.enPassantSquare = [];
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
        if (client.userData.color) {
            this.playerData.blackPlayer = client;
        } else {
            this.playerData.whitePlayer = client;
        }
        client.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures]));
    }


    move = (message, client, isCompMove) => {
        if ((this.whiteTurn && client.userData.color == 0 ||
            (!this.whiteTurn && client.userData.color == 1) ||
            isCompMove)) {

            let result = this.makeMove(message.body, this.board, this.whiteTurn, this.enPassantSquare, this.canCastle);

                if (isCompMove){
                    console.log(message.body, result)
                }

            //update captures object
            if (result[0]) {
                if (result[3]) {
                    this.captures[this.whiteTurn ? 'white' : 'black'][result[3]]++;
                }

                if (this.lastMove.length) {
                    result[2].push(this.lastMove[0], this.lastMove[1]);
                }

                this.lastMove = result[4];

                this.whiteTurn = !this.whiteTurn;
                this.enPassantSquare = result[0];
                client.send(JSON.stringify([this.board, this.whiteTurn, result[1], result[2], this.captures, this.lastMove]));


                //send human move to computer
                if (!isCompMove) {
                    this.sendBoard(this.getGameState())
                        .then((computerMove) => {
                            //console.log(computerMove);
                            //this.move({ body: { piece: '41', move: '43' } }, client, true)
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
        client.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures, this.lastMove]));
    }


    reloadBoard = (wss, color) => {
        wss.clients.forEach(client_ => {
            if (client_.userData.gameID == this.gameID && client_.userData.color !== color) {
                //console.log(client.userData.name)
                console.log(this.playerData)
                client_.send(JSON.stringify([this.board, this.whiteTurn, "", [], this.captures, this.lastMove, { whitePlayer: this.playerData.whitePlayer?.userData?.name, blackPlayer: this.playerData.blackPlayer?.userData?.name }]));
            }
        });
    }

    getGameState = () => {
        return {
            board: this.board,
            castling: this.canCastle,
            enPassant: this.enPassantSquare,
            whiteTurn: this.whiteTurn
        }
    }

    sendBoard = (game) => {
        return new Promise((resolve, reject) => {
            let data = JSON.stringify(game);
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