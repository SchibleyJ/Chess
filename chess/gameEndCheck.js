//this method will be a check for whether the game has ended

const pseudoLegalCheck = require("./pseudoLegalCheck");

const gameEndCheck = (oldBoard, whiteTurn, enPassantSquare, canCastle) => {
    //get all legal moves:
    //moves is array of moves in a string formattes as pieceXpieceYmoveXmoveY, i.e. 5153
    
    //don't know if i need to copy board but maybe
    let board = [];
    for (let i = 0; i < 8; i++){
        board.push(Array.from(oldBoard[i]));
    }
    let moves = [];
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (board[i][j] != 0 && board[i][j].isWhite == whiteTurn){
                let temp = (board[i][j].getMoves(board, j, i, enPassantSquare)).filter(move => !move.includes("8") && !move.includes("9") && !move.includes("-"));
                for (let k = 0; k < temp.length; k++){
                    temp[k] = j + "" + i + temp[k];
                }
                moves = moves.concat(temp);
                //console.log(moves);
            }
        }
    }


    //oh god
    for (let i = 0; i < moves.length; i++){
        //console.log(moves[i][0], moves[i][1], moves[i][2], moves[i][3]);
        //console.log(board[moves[i][1]][moves[i][0]]);
        //console.log(moves[i]);
        let moveResponse = board[moves[i][1]][moves[i][0]].isLegalMove(board, parseInt(moves[i][0]), parseInt(moves[i][1]), parseInt(moves[i][2]), parseInt(moves[i][3]), enPassantSquare, canCastle);
        //console.log(moveResponse);
        //console.log(moveResponse);
        if (!pseudoLegalCheck(board, moveResponse, whiteTurn, moves[i][0], moves[i][1], moves[i][2], moves[i][3])){
            //not checkmate or stalemate 
            moves.splice(i--, 1);
        }
    } //for now
return moves;
}


module.exports = gameEndCheck;