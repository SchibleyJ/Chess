const Knight = class Knight {
    constructor(isWhite){
        this.isWhite = isWhite;
        this.image = (isWhite ? `whiteKnight.png` : `blackKnight.png`);
        this.piece = "knight";
    }
    isLegalMove(board, pieceX, pieceY, moveX, moveY) {
        if ((Math.abs(pieceX - moveX) == 1 && Math.abs(pieceY - moveY) == 2) || 
            (Math.abs(pieceX - moveX) == 2 && Math.abs(pieceY - moveY) == 1)){
                if (!board[moveY][moveX] || board[moveY][moveX].isWhite !== this.isWhite) {
                    return [this.piece, false, , ,board[moveY][moveX].piece];   
                } else {
                    return false;
                }
            } else {
                return false;
            }
    }

    getAttacking(board, pieceX, pieceY) {
        return [(pieceX + 1) + "" + (pieceY + 2),
                (pieceX - 1) + "" + (pieceY + 2),
                (pieceX + 2) + "" + (pieceY + 1),
                (pieceX - 2) + "" + (pieceY + 1),
                (pieceX + 2) + "" + (pieceY - 1),
                (pieceX - 2) + "" + (pieceY - 1),
                (pieceX + 1) + "" + (pieceY - 2),
                (pieceX - 1) + "" + (pieceY - 2)
                ];
    }

    getMoves(board, pieceX, pieceY) {
        let moves = [(pieceX + 1) + "" + (pieceY + 2),
                (pieceX - 1) + "" + (pieceY + 2),
                (pieceX + 2) + "" + (pieceY + 1),
                (pieceX - 2) + "" + (pieceY + 1),
                (pieceX + 2) + "" + (pieceY - 1),
                (pieceX - 2) + "" + (pieceY - 1),
                (pieceX + 1) + "" + (pieceY - 2),
                (pieceX - 1) + "" + (pieceY - 2)
                ];
                
                moves = moves.filter(move => !move.includes("8") && !move.includes("9") && !move.includes("-"));


                for (let i = 0; i < moves.length; i++){
                    if (board[(moves[i])[1]][(moves[i])[0]].isWhite === this.isWhite){
                        moves.splice(i--, 1);
                    }
                }
        return moves;
    }
}

module.exports = Knight;