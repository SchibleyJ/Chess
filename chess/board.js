let King = require('./king.js');
let Queen = require('./queen.js');
let Rook = require('./rook.js');
let Bishop = require('./bishop.js');
let Knight = require('./knight.js');
let Pawn = require('./pawn.js');
const createBoard = () => {
    //0 always means a square is empty
    let board =
        [           /*a, b, c, d, e, f, g, h*/
            /*0, 1, 2, 3, 4, 5, 6, 7*/
    /*8 (0)*/[0, 0, 0, 0, 0, 0, 0, 0],
    /*7 (1)*/[0, 0, 0, 0, 0, 0, 0, 0],
    /*6 (2)*/[0, 0, 0, 0, 0, 0, 0, 0],
    /*5 (3)*/[0, 0, 0, 0, 0, 0, 0, 0],
    /*4 (4)*/[0, 0, 0, 0, 0, 0, 0, 0],
    /*3 (5)*/[0, 0, 0, 0, 0, 0, 0, 0],
    /*2 (6)*/[0, 0, 0, 0, 0, 0, 0, 0],
    /*1 (7)*/[0, 0, 0, 0, 0, 0, 0, 0],
        ];



    //kings
    board[7][4] = new King(true);
    board[0][4] = new King(false);

    //queens
    board[7][3] = new Queen(true);
    board[0][3] = new Queen(false);

    //bishops
    board[7][2] = new Bishop(true);
    board[7][5] = new Bishop(true);
    board[0][2] = new Bishop(false);
    board[0][5] = new Bishop(false);

    //knights
    board[7][1] = new Knight(true);
    board[7][6] = new Knight(true);
    board[0][1] = new Knight(false);
    board[0][6] = new Knight(false);

    //rooks
    board[7][0] = new Rook(true);
    board[7][7] = new Rook(true);
    board[0][0] = new Rook(false);
    board[0][7] = new Rook(false);

    //pawns
    for (let i = 0; i < 8; i++) {
        board[6][i] = new Pawn(true);
        board[1][i] = new Pawn(false);
    }
    //

    return board;
}

module.exports = createBoard;