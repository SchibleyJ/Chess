const Bishop = class Bishop {
    constructor(isWhite) {
        this.isWhite = isWhite;
        this.image = (isWhite ? `whiteBishop.png` : `blackBishop.png`);
        this.piece = "bishop";
        this.value = 330;
    }



    isLegalMove(board, pieceX, pieceY, moveX, moveY) {
        if (Math.abs(pieceX - moveX) == Math.abs(pieceY - moveY)) {
                for (let i = Math.abs(moveY - pieceY) - 1; i > 0; i--) {
                    if (board[pieceY + (Math.sign(moveY - pieceY) * i)][pieceX + (Math.sign(moveX - pieceX) * i)] !== 0) {
                        return false;
                    }
                }
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

    //THESE TWO METHODS SHOULD BE COMBINDED AT SOME POINT, ADDING A SIMPLE BOOLEAN TO RETURN ALL ATTACKING OR JUST MOVES WOULD BE SIMPLE ENOUGH

    getMoves(board, pieceX, pieceY) {
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

}

module.exports = Bishop;