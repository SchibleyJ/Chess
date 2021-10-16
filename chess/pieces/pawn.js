const Pawn = class Pawn {
    constructor(isWhite) {
        this.isWhite = isWhite;
        this.image = (isWhite ? `whitePawn.png` : `blackPawn.png`);
        this.piece = "pawn";
        this.hasMoved = false;
        this.value = 100;
    }

    isLegalMove(board, pieceX, pieceY, moveX, moveY, enPassantSquare) {
        
        //console.log(enPassantSquare)
        if (moveX == pieceX && board[pieceY + (this.isWhite ? -1 : 1)][pieceX] == 0) {
            if (pieceY - moveY == (this.isWhite ? 1 : -1)) {
                //this.hasMoved = true;
                return [this.piece, false, , ,];
            } else if (!this.hasMoved && board[pieceY + (this.isWhite ? -2 : 2)][pieceX] == 0 && pieceY - moveY == (this.isWhite ? 2 : -2)) {
                //this.hasMoved = true;
                return [this.piece, false, , ,];
            } else {
                /*console.log(!this.hasMoved && board[pieceY + (this.isWhite ? -2 : 2)][pieceX] == 0 && pieceY - moveY == (this.isWhite ? 2 : -2));
                console.log(!this.hasMoved , board[pieceY + (this.isWhite ? -2 : 2)][pieceX] == 0 , pieceY - moveY == (this.isWhite ? 2 : -2));
                */

                return false;
            }
        } else if (Math.abs(moveX - pieceX) == 1 && pieceY - moveY == (this.isWhite ? 1 : -1)) {
            if (moveX == enPassantSquare[0] && moveY == enPassantSquare[1]) {
                //this.hasMoved = true;

                return [this.piece, true, , , "pawn"];
            }
            if (board[moveY][moveX] && board[moveY][moveX].isWhite != this.isWhite) {
                //this.hasMoved = true;
                return [this.piece, false, , , board[moveY][moveX].piece];
            }
            return false;
        }

    }

    getAttacking(board, pieceX, pieceY) {
        return [(pieceX + 1) + "" + (pieceY + (this.isWhite ? -1 : 1)), (pieceX - 1) + "" + (pieceY + (this.isWhite ? -1 : 1))];
    }

    //getMoves is very similar to getAttacking and i feel bad but i dont want to combine them
    getMoves(board, pieceX, pieceY, enPassantSquare) {
        let moves = [];
        if (board[pieceY + (this.isWhite ? -1 : 1)][pieceX] == 0) {
            moves.push(pieceX + "" + (pieceY + (this.isWhite ? -1 : 1)));
            if (board[pieceY + (this.isWhite ? -2 : 2)][pieceX] !== undefined) {
                if (board[pieceY + (this.isWhite ? -2 : 2)][pieceX] == 0 && !this.hasMoved) {
                    moves.push(pieceX + "" + (pieceY + (this.isWhite ? -2 : 2)));
                }
            }
        }
        if (board[pieceY + (this.isWhite ? -1 : 1)][pieceX + 1] !== undefined) {
            if ((board[pieceY + (this.isWhite ? -1 : 1)][pieceX + 1] !== 0 && board[pieceY + (this.isWhite ? -1 : 1)][pieceX + 1].isWhite != this.isWhite) || ((pieceY + (this.isWhite ? -1 : 1) == enPassantSquare[1]) && pieceX + 1 == enPassantSquare[0])) {
                moves.push((pieceX + 1) + "" + (pieceY + (this.isWhite ? -1 : 1)));
            }
        }
        if (board[pieceY + (this.isWhite ? -1 : 1)][pieceX - 1] !== undefined) {
            if ((board[pieceY + (this.isWhite ? -1 : 1)][pieceX - 1] !== 0 && board[pieceY + (this.isWhite ? -1 : 1)][pieceX - 1].isWhite != this.isWhite) || ((pieceY + (this.isWhite ? -1 : 1) == enPassantSquare[1]) && pieceX - 1 == enPassantSquare[0])) {
                moves.push((pieceX - 1) + "" + (pieceY + (this.isWhite ? -1 : 1)));
            }
        }
        //console.log(moves)
        return moves;

    }



}

module.exports = Pawn;