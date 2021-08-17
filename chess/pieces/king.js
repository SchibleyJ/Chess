let getAttacked = require('./getAttacked.js');

const King = class King {
    constructor(isWhite) {
        this.isWhite = isWhite;
        this.image = (isWhite ? `whiteKing.png` : `blackKing.png`);
        this.piece = "king";
    }

    isLegalMove(board, pieceX, pieceY, moveX, moveY, x, canCastle) {

        let illegalMoves = getAttacked(board, !this.isWhite);

        if (Math.abs(moveX - pieceX) <= 1 && Math.abs(moveY - pieceY) <= 1) {
            if (board[moveY][moveX] == 0) {
                return [this.piece, false, , ,];

            }
            else if (board[moveY][moveX].isWhite != this.isWhite) {
                return [this.piece, false, , , board[moveY][moveX].piece];
            } else {
                return false;
            }
        } else {
            if (moveX == 6 && moveY == 7 && this.isWhite && canCastle[0] && board[7][5] == 0 && board[7][6] == 0) {
                if (illegalMoves.includes("57") || illegalMoves.includes("67")) {
                    return false;
                } else {
                    return [this.piece, false, , "7757",];
                }
            }
            if (moveX == 2 && moveY == 7 && this.isWhite && canCastle[1] && board[7][1] == 0 && board[7][2] == 0 && board[7][3] == 0) {
                if (illegalMoves.includes("17") || illegalMoves.includes("27") || illegalMoves.includes("37")) {
                    return false;
                } else {
                    return [this.piece, false, , "0737",];
                }
            }
            if (moveX == 6 && moveY == 0 && !this.isWhite && canCastle[2] && board[0][5] == 0 && board[0][6] == 0) {
                if (illegalMoves.includes("50") || illegalMoves.includes("60")) {
                    return false;
                } else {
                    return [this.piece, false, , "7050",];
                }
            }
            if (moveX == 2 && moveY == 0 && !this.isWhite && canCastle[3] && board[0][1] == 0 && board[0][2] == 0 && board[0][3] == 0) {
                if (illegalMoves.includes("10") || illegalMoves.includes("20") || illegalMoves.includes("30")) {
                    return false;
                } else {
                    return [this.piece, false, , "0030",];
                }
            }
            return false;
        }
    }
    getAttacking(board, pieceX, pieceY) {
        let moves = [];
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                moves.push((pieceX + i) + "" + (pieceY + j));
            }
        }
        return moves;
    }

    //getMoves is very similar to getAttacking and i feel bad but i dont want to combine them
    getMoves(board, pieceX, pieceY){
        let moves = [];
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                moves.push((pieceX + i) + "" + (pieceY + j));
            }
        }
        moves = moves.filter(move => !move.includes("8") && !move.includes("9") && !move.includes("-"));
        for (let i = 0; i < moves.length; i++){
            if (board[(moves[i])[1]][(moves[i])[0]].isWhite == this.isWhite){
                moves.splice(i--, 1);
            }
        }
        return moves;
    }

}

module.exports = King;