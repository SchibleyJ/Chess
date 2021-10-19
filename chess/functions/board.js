const createBoard = () => {

    // Pawn = 1
    // Knight = 2
    // Bishop = 3
    // Rook = 4
    // Queen = 5
    // King = 6
    // add 10 if white
    const board = Array(64).fill(0);
    
    //kings
    board[60] = 16;
    board[4] = 06;
    
    //queens
    board[3] = 05;
    board[59] = 15;
    
    //bishops
    board[61] = 13;
    board[58] = 13;
    board[5] = 03
    board[2] = 03;
    
    //knights
    board[62] = 12;
    board[57] = 12;
    board[6] = 02;
    board[1] = 02;
    
    //rooks
    board[63] = 14;
    board[56] = 14;
    board[7] = 04;
    board[0] = 04;
    
    //pawns 
    for (let i = 0; i < 8; i++){
        board[i + 8] = 01;
        board[i + 48] = 11;
    }
    
        return board;
    }
    
module.exports = createBoard;