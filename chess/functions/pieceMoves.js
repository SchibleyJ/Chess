const getAttacking = require('./getAttacking.js');

//// returns object;
/* {
    'move': moveIndex,
    'type': (0, 1, or 2),
    'data': (data if type is 1 or 2)}
    type = 0 means normal
    type = 1 means enpassant
    type = 2 means castle
*/
const pieceMoves = (board, whiteTurn, pieceIndex, enPassant, castling) => {
    const attackedSquares = getAttacking(board, !whiteTurn, enPassant, castling);
    let distancesToBoardEdges = getDistancesToBoardEdges(board, pieceIndex);
    switch (board[pieceIndex] % 10) {
        case 1:
            return pawnMoves(board, pieceIndex, distancesToBoardEdges, enPassant, whiteTurn);
            break;
        case 2:
            return knightMoves(board, pieceIndex, distancesToBoardEdges);
            break;
        case 3:
            return bishopMoves(board, pieceIndex, distancesToBoardEdges);
            break;
        case 4:
            return rookMoves(board, pieceIndex, distancesToBoardEdges);
            break;
        case 5:
            return queenMoves(board, pieceIndex, distancesToBoardEdges);
            break;
        case 6:
            return kingMoves(board, pieceIndex, distancesToBoardEdges, castling, attackedSquares);
            break;
    }
}


const getDistancesToBoardEdges = (board, pieceIndex) => {
    let distances = new Array(64);
    for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
            distances[file * 8 + rank] =
            {
                "upDistance": file,
                "leftDistance": rank,
                "downDistance": 7 - file,
                "rightDistance": 7 - rank
            }
        }
    }

    return distances;

}


const pawnMoves = (board, pieceIndex, distancesToBoardEdges, enPassant, whiteTurn) => {
    let moves = [];
    let color = (getColor(board, pieceIndex) ? -1 : 1);
    if (!board[pieceIndex + (8 * color)]) {
        moves.push({'move': pieceIndex + (8 * color), 'type': 0});
    }
    if (!board[pieceIndex + (8 * color)] && !board[pieceIndex + (16 * color)] &&
        ((color == -1 && (pieceIndex >= 48 && pieceIndex <= 55)) ||
            (color == 1 && (pieceIndex >= 8 && pieceIndex <= 15)))) {
        moves.push({'move': pieceIndex + (16 * color), 'type': 0});
    }
    if (distancesToBoardEdges[pieceIndex].leftDistance != 0 && (board[(pieceIndex + (8 * color)) - 1]) && (getColor(board, (pieceIndex + (8 * color)) - 1) !== getColor(board, pieceIndex))) {
        moves.push(({'move': pieceIndex + (8 * color) - 1, 'type': 0}));
    }
    if (distancesToBoardEdges[pieceIndex].rightDistance != 0 && (board[(pieceIndex + (8 * color)) + 1]) && (getColor(board, (pieceIndex + (8 * color)) + 1) !== getColor(board, pieceIndex))) {
        moves.push(({'move': pieceIndex + (8 * color) + 1, 'type': 0}));
    }
    if (enPassant == (pieceIndex + (8 * color)) - 1 || enPassant == (pieceIndex + (8 * color)) + 1) {
        moves.push({'move': enPassant, 'type': 1, 'data': enPassant + (8 * (whiteTurn ? 1 : -1))});
    }
    return moves;

}

const knightMoves = (board, pieceIndex, distancesToBoardEdges) => {
    let moves = [];

    const localKnightMoves = (distance1, distance2, distance3, moveAmount1, moveAmount2) => {
        if (distance1 >= 2) {
            if ((checkTakeSquare(board, pieceIndex, moveAmount1)) && distance2 >= 1)
                moves.push({'move': pieceIndex + moveAmount1, 'type': 0});
            if ((checkTakeSquare(board, pieceIndex, moveAmount2)) && distance3 >= 1)
                moves.push({'move': pieceIndex + moveAmount2, 'type': 0});
        }
    }

    localKnightMoves(distancesToBoardEdges[pieceIndex].upDistance, distancesToBoardEdges[pieceIndex].leftDistance, distancesToBoardEdges[pieceIndex].rightDistance, -17, -15);
    localKnightMoves(distancesToBoardEdges[pieceIndex].leftDistance, distancesToBoardEdges[pieceIndex].upDistance, distancesToBoardEdges[pieceIndex].downDistance, -10, 6);
    localKnightMoves(distancesToBoardEdges[pieceIndex].downDistance, distancesToBoardEdges[pieceIndex].leftDistance, distancesToBoardEdges[pieceIndex].rightDistance, 15, 17);
    localKnightMoves(distancesToBoardEdges[pieceIndex].rightDistance, distancesToBoardEdges[pieceIndex].upDistance, distancesToBoardEdges[pieceIndex].downDistance, -6, 10);
    return moves;
}


const bishopMoves = (board, pieceIndex, distancesToBoardEdges) => {
    let moves = [];
    const localBishopMoves = (distance1, distance2, moveAmount) => {
        for (let i = 1; i <= Math.min(distance1, distance2); i++) {
            if (!board[pieceIndex + (i * moveAmount)]) {
                moves.push({'move': pieceIndex + (i * moveAmount), 'type': 0});
            } else if (checkTakeSquare(board, pieceIndex, (i * moveAmount))) {
                moves.push({'move': pieceIndex + (i * moveAmount), 'type': 0});
                break;
            } else {
                break;
            }
        }
    }

    localBishopMoves(distancesToBoardEdges[pieceIndex].leftDistance, distancesToBoardEdges[pieceIndex].upDistance, -9);
    localBishopMoves(distancesToBoardEdges[pieceIndex].leftDistance, distancesToBoardEdges[pieceIndex].downDistance, 7);
    localBishopMoves(distancesToBoardEdges[pieceIndex].rightDistance, distancesToBoardEdges[pieceIndex].downDistance, 9);
    localBishopMoves(distancesToBoardEdges[pieceIndex].rightDistance, distancesToBoardEdges[pieceIndex].upDistance, -7);
    
    return moves;
}


const rookMoves = (board, pieceIndex, distancesToBoardEdges) => {
    let moves = [];

    const localRookMoves = (distance, moveAmount) => {
        for (let i = 1; i <= distance; i++) {
            if (!board[pieceIndex + (i * moveAmount)]) {
                moves.push({'move': pieceIndex + (i * moveAmount), 'type': 0});
            } else if (checkTakeSquare(board, pieceIndex, (i * moveAmount))) {
                moves.push({'move': pieceIndex + (i * moveAmount), 'type': 0});
                break;
            } else {
                break;
            }
        }
    }

    localRookMoves(distancesToBoardEdges[pieceIndex].upDistance, -8);
    localRookMoves(distancesToBoardEdges[pieceIndex].leftDistance, -1);
    localRookMoves(distancesToBoardEdges[pieceIndex].downDistance, 8);
    localRookMoves(distancesToBoardEdges[pieceIndex].rightDistance, 1);
    
    return moves;

}

const queenMoves = (board, pieceIndex, distancesToBoardEdges) => {
    let moves = [];
    moves = moves.concat(rookMoves(board, pieceIndex, distancesToBoardEdges), bishopMoves(board, pieceIndex, distancesToBoardEdges));
    return moves;
}

const kingMoves = (board, pieceIndex, distancesToBoardEdges, castling, attackedSquares) => {
    let moves = [];
    let [up, left, down, right] = [distancesToBoardEdges[pieceIndex].upDistance >= 1, distancesToBoardEdges[pieceIndex].leftDistance >= 1, distancesToBoardEdges[pieceIndex].downDistance >= 1, distancesToBoardEdges[pieceIndex].rightDistance >= 1];
    if (up && checkTakeSquare(board, pieceIndex, -8)) {
        moves.push({'move': pieceIndex - 8, 'type': 0});
    }
    if (left && checkTakeSquare(board, pieceIndex, -1)) {
        moves.push({'move': pieceIndex - 1, 'type': 0});
    }
    if (down && checkTakeSquare(board, pieceIndex, 8)) {
        moves.push({'move': pieceIndex + 8, 'type': 0});
    }
    if (right && checkTakeSquare(board, pieceIndex, 1)) {
        moves.push({'move': pieceIndex + 1, 'type': 0});
    }
    if (up && left && checkTakeSquare(board, pieceIndex, -9)) {
        moves.push({'move': pieceIndex - 9, 'type': 0});
    }
    if (up && right && checkTakeSquare(board, pieceIndex, -7)) {
        moves.push({'move': pieceIndex - 7, 'type': 0});
    }
    if (down && left && checkTakeSquare(board, pieceIndex, 7)) {
        moves.push({'move': pieceIndex + 7, 'type': 0});
    }
    if (down && right && checkTakeSquare(board, pieceIndex, 9)) {
        moves.push({'move': pieceIndex + 9, 'type': 0});
    }
    if (getColor(board, pieceIndex)) {
        if (!board[59] && !board[58] && !board[57] && castling[0] 
            && !attackedSquares.includes(pieceIndex) 
            && !attackedSquares.includes(59) 
            && !attackedSquares.includes(58) 
            && !attackedSquares.includes(57)) {
            moves.push({'move': 58, 'type': 2, 'data': [59, 56], });
        }
        if (!board[61] && !board[62] && castling[1] 
            && !attackedSquares.includes(pieceIndex) 
            && !attackedSquares.includes(61) 
            && !attackedSquares.includes(62)) {
            moves.push({'move': 62, 'type': 2, 'data': [61, 63]});
        }
    } else {
        if (!board[3] && !board[2] && !board[1] && castling[2]
            && !attackedSquares.includes(pieceIndex) 
            && !attackedSquares.includes(3) 
            && !attackedSquares.includes(2) 
            && !attackedSquares.includes(1)) {
            moves.push({'move': 2, 'type': 2, 'data': [3, 0]});
        }
        if (!board[5] && !board[6] && castling[3]
            && !attackedSquares.includes(pieceIndex) 
            && !attackedSquares.includes(5) 
            && !attackedSquares.includes(6)) {
            moves.push({'move': 6, 'type': 2, 'data': [5, 7]});
        }
    }
    return moves;


}


const getColor = (board, pieceIndex) => {
    return Math.floor(board[pieceIndex] / 10);
}

const checkTakeSquare = (board, pieceIndex, moveAmount) => {
    return (!board[pieceIndex + moveAmount] || (getColor(board, (pieceIndex + moveAmount)) !== getColor(board, pieceIndex)));
}

module.exports = pieceMoves;