const pieceMoves = require('./pieceMoves.js');
const pseudoLegalCheck = require('./pseudoLegalCheck.js');

const getLegalMoves = (board, whiteTurn, enPassantSquare, canCastle) => {
    let legalMoves = new Array(64);
    for (let i = 0; i < board.length; i++) {
        if ((Math.floor(board[i] / 10)) == whiteTurn && board[i]) {
            let potentialMoves = pieceMoves(board, whiteTurn, i, enPassantSquare, canCastle);
            let localLegalMoves = [];
            for (let j = 0; j < potentialMoves.length; j++){
                if (!pseudoLegalCheck(i, potentialMoves[j].move, board, whiteTurn, potentialMoves[j].type, potentialMoves[j].type ? potentialMoves[j].data : null)){
                    //console.log(potentialMoves[j])
                    potentialMoves.splice(j--, 1);
                } else {
                    //console.log(potentialMoves[j])
                    localLegalMoves.push(potentialMoves[j].move);
                }
            }
            legalMoves[i] = localLegalMoves;
        } else {
            legalMoves[i] = null;
        }
    }


    return legalMoves;
}

module.exports = getLegalMoves;


