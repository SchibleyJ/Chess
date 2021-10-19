const getLegalMoves = require('./getLegalMoves.js');

const makeMove = (body, board, whiteTurn, enPassantSquare, canCastle) => {
    let moveFrom = body.moveFrom;
    let moveTo = body.moveTo;
    if (!board[moveFrom] || Math.floor(board[moveFrom] / 10) != whiteTurn){
        return false;
    }
    //generate all legal moves
    let allLegalMoves = getLegalMoves(board, whiteTurn, enPassantSquare, canCastle);
    //console.log(allLegalMoves)
    if (allLegalMoves[moveFrom].includes(moveTo)) {
        let newEnPassant = null;
        let newCastling = canCastle;
        let updateSquares = [moveFrom, moveTo];
        let wasEnPassant = false;
        let wasCastle = false;
        //new enpassant and update
        if (board[moveFrom] % 10 == 1) {
            if (Math.abs(moveTo - moveFrom) == 16) {
                newEnPassant = moveTo + (8 * (whiteTurn ? 1 : -1));
            }
            if (moveTo == enPassantSquare){
                updateSquares.push(moveTo + (8 * (whiteTurn ? 1 : -1)));
                wasEnPassant = moveTo + (8 * (whiteTurn ? 1 : -1));
            }
        }

        //castling if king moved
        if (board[moveFrom] % 10 == 6) {
            if (Math.abs(moveFrom - moveTo) == 2){
                switch (moveTo) {
                    case 62:
                        wasCastle = [61, 63];
                        break;
                    case 58:
                        wasCastle = [59, 56];
                        break;
                    case 6:
                        wasCastle = [5, 7];
                        break;
                    case 2:
                        wasCastle = [3, 0];
                        break;
                }
            }
            newCastling[0 + (whiteTurn ? 0 : 2)] = false;
            newCastling[1 + (whiteTurn ? 0 : 2)] = false;
        }
        //castling if rook moved
        if (board[moveFrom] % 10 == 4) {
            if (moveFrom = 0) {
                newCastling[2] = false;
            }
            if (moveFrom = 7) {
                newCastling[3] = false;
            }
            if (moveFrom = 56) {
                newCastling[0] = false;
            }
            if (moveFrom = 63) {
                newCastling[1] = false;
            }

        }


        return {
            "enPassantSquare": newEnPassant,
            "wasEnPassant": wasEnPassant,
            "wasCastle": wasCastle,
            "updateSquares": updateSquares,
            "castling": newCastling,
            piece: board[moveTo]
        }

    } else {
        return false;
    }
}

module.exports = makeMove;
