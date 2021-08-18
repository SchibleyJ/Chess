const Rook = class Rook {
    constructor(isWhite) {
        this.isWhite = isWhite;
        this.image = (isWhite ? `whiteRook.png` : `blackRook.png`);
        this.piece = "rook";
        this.value = 500;
    }

    isLegalMove(board, pieceX, pieceY, moveX, moveY) {
        if (pieceX == moveX) {
            for (let i = 1; i < Math.abs(pieceY - moveY); i++) {
                if (board[(pieceY < moveY ? pieceY : moveY) + i][pieceX] !== 0) {
                    return false;
                }
            }
            if (!board[moveY][moveX] || board[moveY][moveX].isWhite !== this.isWhite) {
                return [this.piece, false, this.#castlingUpdate(pieceY, pieceX), board[moveY][moveX].piece];
            } else {
                return false;
            }
        }
        if (pieceY == moveY) {
            for (let i = 1; i < Math.abs(pieceX - moveX); i++) {
                if (board[pieceY][(pieceX < moveX ? pieceX : moveX) + i] !== 0) {
                    return false;
                }
            }
            if (!board[moveY][moveX] || board[moveY][moveX].isWhite !== this.isWhite) {
                return [this.piece, false, this.#castlingUpdate(pieceY, pieceX), board[moveY][moveX].piece];
            } else {
                return false;
            }
        }
    }


    #castlingUpdate = (pieceY, pieceX) => {
        if (this.isWhite && pieceY == 7 && pieceX == 7) {
            return 0;
        }
        if (this.isWhite && pieceY == 7 && pieceX == 0) {
            return 1;
        }
        if (!this.isWhite && pieceY == 0 && pieceX == 7) {
            return 2;
        }
        if (!this.isWhite && pieceY == 0 && pieceX == 0) {
            return 3;
        }
    }
    getAttacking(board, pieceX, pieceY) {
        let squares = [];
        for (let i = pieceX + 1; i < 8; i++) {
            if (board[pieceY][i] !== 0) {
                squares.push(i + "" + pieceY);
                break;
            } else {
                squares.push(i + "" + pieceY);
            }
        }
        for (let i = pieceX - 1; i > -1; i--) {
            if (board[pieceY][i] !== 0) {
                squares.push(i + "" + pieceY);
                break;
            } else {
                squares.push(i + "" + pieceY);
            }
        }
        for (let i = pieceY + 1; i < 8; i++) {
            if (board[i][pieceX] !== 0) {
                squares.push(pieceX + "" + i);
                break;
            } else {
                squares.push(pieceX + "" + i);
            }
        }
        for (let i = pieceY - 1; i > -1; i--) {
            if (board[i][pieceX] !== 0) {
                squares.push(pieceX + "" + i);
                break;
            } else {
                squares.push(pieceX + "" + i);
            }
        }

        return squares;

    }

    getMoves(board, pieceX, pieceY) {
        let squares = [];
        for (let i = pieceX + 1; i < 8; i++) {
            if (board[pieceY][i] !== 0) {
                if (board[pieceY][i].isWhite !== this.isWhite) {
                    squares.push(i + "" + pieceY);
                }
                break;
            } else {
                squares.push(i + "" + pieceY);
            }
        }
        for (let i = pieceX - 1; i > -1; i--) {
            if (board[pieceY][i] !== 0) {
                if (board[pieceY][i].isWhite !== this.isWhite) {
                    squares.push(i + "" + pieceY);
                }
                break;
            } else {
                squares.push(i + "" + pieceY);
            }
        }
        for (let i = pieceY + 1; i < 8; i++) {
            if (board[i][pieceX] !== 0) {
                if (board[i][pieceX].isWhite !== this.isWhite) {
                    squares.push(pieceX + "" + i);
                }
                break;
            } else {
                squares.push(pieceX + "" + i);
            }
        }
        for (let i = pieceY - 1; i > -1; i--) {
            if (board[i][pieceX] !== 0) {
                if (board[i][pieceX].isWhite !== this.isWhite) {
                    squares.push(pieceX + "" + i);
                }
                break;
            } else {
                squares.push(pieceX + "" + i);
            }
        }

        return squares;

    }
}

module.exports = Rook;