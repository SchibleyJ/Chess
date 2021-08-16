let Queen = require('./queen.js');
let getAttacked = require('./getAttacked.js');

const pseudoLegalCheck = (oldBoard, moveResponse, whiteTurn, pieceX, pieceY, moveX, moveY) => {
    //copy board
    let board = [];
    for (let i = 0; i < 8; i++){
        board.push(Array.from(oldBoard[i]));
    }

    // make turn

    board[moveY][moveX] = board[pieceY][pieceX];
    board[pieceY][pieceX] = 0;

    if (moveResponse[0] == "pawn" && moveY == (whiteTurn ? 0 : 7)) {
        board[moveY][moveX] = new Queen(whiteTurn);
    }
    if (moveResponse[1]) {
        //console.log(moveX, moveY)
        //cannot set propety 3 of undefined
        //console.log(parseInt(moveY) + (whiteTurn ? 1 : -1));
        board[parseInt(moveY) + (whiteTurn ? 1 : -1)][moveX] = 0;
    }
    if (moveResponse[0] == "king") {
        if (moveResponse[3]) {
            board[moveResponse[3][3]][moveResponse[3][2]] = board[moveResponse[3][1]][moveResponse[3][0]];
            board[moveResponse[3][1]][moveResponse[3][0]] = 0;
        }
    }


    //turn complete, board ready for test

    let getKingPos = () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j].piece == "king" && board[i][j].isWhite == whiteTurn) {
                    return j + "" + i;
                }
            }
        }
    }

    kingPos = getKingPos();

    //console.log(kingPos);

    let illegalSquares = getAttacked(board, !whiteTurn);
    //console.log(illegalSquares);
    return (!illegalSquares.includes(kingPos));
}

module.exports = pseudoLegalCheck;