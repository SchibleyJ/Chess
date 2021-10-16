const getAttacked = (board, isWhiteAttacking)=>{
    let attackedSquares = [];

    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (board[i][j] != 0 && board[i][j].isWhite == isWhiteAttacking){
                attackedSquares = attackedSquares.concat(board[i][j].getAttacking(board, j, i));
            }
        }
    }

    attackedSquares = [...new Set(attackedSquares)];

    return attackedSquares.filter(move => !move.includes("8") && !move.includes("9") && !move.includes("-"));

}

module.exports = getAttacked;