const getLegalMoves = require('./getLegalMoves');    
const getAttacking = require('./getAttacking.js')

const gameEndCheck = (oldBoard, whiteTurn, enPassantSquare, canCastle) => {
    let board = Array.from(oldBoard);

    let moves = getLegalMoves(board, whiteTurn, enPassantSquare, canCastle);
    let moveCount = 0;
    for (let i = 0; i < moves.length; i++){
        if (moves[i] && moves[i].length){
            moveCount++;
        }
    }
    if (moveCount){
        return "";
    } else {
        let getKingPos = () => {
            for (let i = 0; i < 64; i++) {
                if (board[i] == 6 + (whiteTurn ? 10 : 0)) {
                    return i;
                }
            }
    
        }
        let kingPos = getKingPos();
        let illegalSquares = getAttacking(board, !whiteTurn);
        if (illegalSquares.includes(kingPos)){
            return "CHECKMATE";
        } else {
            return "STALEMATE";
        }
    }

}


module.exports = gameEndCheck;