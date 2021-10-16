const Queen = class Queen {
    constructor(isWhite) {
        this.isWhite = isWhite;
        this.image = (isWhite ? `whiteQueen.png` : `blackQueen.png`);
        this.piece = "queen";
        this.value = 900;
    }

    isLegalMove(board, pieceX, pieceY, moveX, moveY) {
        let rookLegal = this.#rookLegalMove(board, pieceX, pieceY, moveX, moveY);
        return (rookLegal ? rookLegal : this.#bishopLegalMove(board, pieceX, pieceY, moveX, moveY));
    }

    getAttacking(board, pieceX, pieceY) {
        return this.#rookAttacking(board, pieceX, pieceY).concat(this.#bishopAttacking(board, pieceX, pieceY));
    }

    getMoves(board, pieceX, pieceY) {
        return this.#rookMoves(board, pieceX, pieceY).concat(this.#bishopMoves(board, pieceX, pieceY));
    }


    #rookLegalMove = (board, pieceX, pieceY, moveX, moveY) => {
        if (pieceX == moveX) {
            for (let i = 1; i < Math.abs(pieceY - moveY); i++) {
                if (board[(pieceY < moveY ? pieceY : moveY) + i][pieceX] !== 0) {
                    return false;
                }
            }
            if (!board[moveY][moveX] || board[moveY][moveX].isWhite !== this.isWhite) {
                return [this.piece, false, , , board[moveY][moveX].piece];
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
                return [this.piece, false, , , board[moveY][moveX].piece];
            } else {
                return false;
            }
        }
    }
    #bishopLegalMove = (board, pieceX, pieceY, moveX, moveY) => {
        if (Math.abs(pieceX - moveX) == Math.abs(pieceY - moveY)) {
            for (let i = Math.abs(moveY - pieceY) - 1; i > 0; i--) {
                if (board[pieceY + (Math.sign(moveY - pieceY) * i)][pieceX + (Math.sign(moveX - pieceX) * i)] !== 0) {
                    return false;
                }
            }
            if (!board[moveY][moveX] || board[moveY][moveX].isWhite !== this.isWhite) {
                return [this.piece, false, , , board[moveY][moveX].piece];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    #rookAttacking = (board, pieceX, pieceY) => {
        let squares = [];
        for (let i = pieceX + 1; i < 8; i++){
            if (board[pieceY][i] !== 0){
                squares.push(i + "" + pieceY);
                break;
            } else {
                squares.push(i + "" + pieceY);
            }
        }
        for (let i = pieceX - 1; i > -1; i--){
            if (board[pieceY][i] !== 0){
                squares.push(i + "" + pieceY);
                break;
            } else {
                squares.push(i + "" + pieceY);
            }
        }
        for (let i = pieceY + 1; i < 8; i++){
            if (board[i][pieceX] !== 0){
                squares.push(pieceX + "" + i);
                break;
            } else {
                squares.push(pieceX + "" + i);
            }
        }
        for (let i = pieceY - 1; i > -1; i--){
            if (board[i][pieceX] !== 0){
                squares.push(pieceX + "" + i);
                break;
            } else {
                squares.push(pieceX + "" + i);
            }
        }

        return squares;
    }

    #bishopAttacking = (board, pieceX, pieceY) => {
        
        let squares = [];
        for (let i = 1; i < 8; i++){
            if (pieceX + i == 8 || pieceY + i == 8){
                break;
            }
            if (board[pieceY + i][pieceX + i] !== 0){
                squares.push((pieceX + i) + "" + (pieceY + i));
                break;
            } else {
                squares.push((pieceX + i) + "" + (pieceY + i));
            }
        }
        for (let i = 1; i < 8; i++){
            if (pieceX + i == 8 || pieceY - i == -1){
                break;
            }
            if (board[pieceY - i][pieceX + i] !== 0){
                squares.push((pieceX + i) + "" + (pieceY - i));
                break;
            } else {
                squares.push((pieceX + i) + "" + (pieceY - i));
            }
        }
        for (let i = 1; i < 8; i++){
            if (pieceX - i == -1 || pieceY - i == -1){
                break;
            }
            if (board[pieceY - i][pieceX - i] !== 0){
                squares.push((pieceX - i) + "" + (pieceY - i));
                break;
            } else {
                squares.push((pieceX - i) + "" + (pieceY - i));
            }
        }
        for (let i = 1; i < 8; i++){
            if (pieceX - i == -1 || pieceY + i == 8){
                break;
            }
            if (board[pieceY + i][pieceX - i] !== 0){
                squares.push((pieceX - i) + "" + (pieceY + i));
                break;
            } else {
                squares.push((pieceX - i) + "" + (pieceY + i));
            }
        }

        return squares;
    }

    //im sorry

    #bishopMoves = (board, pieceX, pieceY) => {
            let squares = [];
            for (let i = 1; i < 8; i++){
                if (pieceX + i == 8 || pieceY + i == 8){
                    break;
                }
                if (board[pieceY + i][pieceX + i] !== 0){
                    if (board[pieceY + i][pieceX + i].isWhite !== this.isWhite){
                    squares.push((pieceX + i) + "" + (pieceY + i));
                    }
                    break;
                } else {
                    squares.push((pieceX + i) + "" + (pieceY + i));
                }
            }
            for (let i = 1; i < 8; i++){
                if (pieceX + i == 8 || pieceY - i == -1){
                    break;
                }
                if (board[pieceY - i][pieceX + i] !== 0){
                    if (board[pieceY - i][pieceX + i].isWhite !== this.isWhite){
                    
                    squares.push((pieceX + i) + "" + (pieceY - i));
                    }
                    break;
                } else {
                    squares.push((pieceX + i) + "" + (pieceY - i));
                }
            }
            for (let i = 1; i < 8; i++){
                if (pieceX - i == -1 || pieceY - i == -1){
                    break;
                }
                if (board[pieceY - i][pieceX - i] !== 0){
                    if (board[pieceY - i][pieceX - i].isWhite !== this.isWhite){
                    
                    squares.push((pieceX - i) + "" + (pieceY - i));
                    }
                    break;
                } else {
                    squares.push((pieceX - i) + "" + (pieceY - i));
                }
            }
            for (let i = 1; i < 8; i++){
                if (pieceX - i == -1 || pieceY + i == 8){
                    break;
                }
                if (board[pieceY + i][pieceX - i] !== 0){
                    if (board[pieceY + i][pieceX - i].isWhite !== this.isWhite){
    
                    squares.push((pieceX - i) + "" + (pieceY + i));
                    }
                    break;
                } else {
                    squares.push((pieceX - i) + "" + (pieceY + i));
                }
            }
    
            return squares;
            
        }
    
        #rookMoves = (board, pieceX, pieceY) => {
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
                if (board[i][pieceX].isWhite !== this.isWhite) {
                    if (board[i][pieceX] !== 0) {
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



module.exports = Queen;