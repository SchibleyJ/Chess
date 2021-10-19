const pieceAttacking = require('./pieceAttacking.js');

const getAttacking = (board, whiteTurn, enPassantSquare, canCastle) => {
    let attacks = [];
    for (let i = 0; i < board.length; i++) {
        if ((Math.floor(board[i] / 10)) == whiteTurn && board[i]) {
            attacks = attacks.concat(pieceAttacking(board, i, enPassantSquare, canCastle));
        }
    }
    attacks = [...new Set(attacks)];

    return attacks;
}

module.exports = getAttacking;