const getAttacking = require('./getAttacking.js');
const pseudoLegalCheck = (moveFrom, moveTo, oldBoard, whiteTurn, moveType, moveData) => {

    let board = Array.from(oldBoard);
    
    if (!board[moveFrom] || Math.floor(board[moveFrom] / 10) != whiteTurn) {
        //console.log(board[moveFrom])
        console.log('here')
        return false;
    }
    //generate all legal moves

    if (moveType == 1){
        board[moveData] = 0;
    }

    if (moveType == 2) {
        board[moveData[0]] = board[moveData[1]]
        board[moveData[1]] = 0;
    }

    board[moveTo] = board[moveFrom];
    board[moveFrom] = 0;
    
    if (board[moveTo] % 10 == 1){
        if (moveTo < 8 || moveTo > 55){
            board[moveTo] = board[moveTo] + 4;
        }
    }

    let getKingPos = () => {
        for (let i = 0; i < 64; i++) {
            if (board[i] == 6 + (whiteTurn ? 10 : 0)) {
                return i;
            }
        }

    }

    let kingPos = getKingPos();

    let illegalSquares = getAttacking(board, !whiteTurn);
    //console.log(kingPos)
    //console.log(illegalSquares)
    //returns true if position is legal
    return (!illegalSquares.includes(kingPos));

}


module.exports = pseudoLegalCheck;
