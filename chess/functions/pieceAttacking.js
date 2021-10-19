const pieceAttacking = (board, pieceIndex, enPassant, castling) => {
    let distancesToBoardEdges = getDistancesToBoardEdges(board, pieceIndex);
    switch (board[pieceIndex] % 10) {
        case 1:
            return pawnAttacks(board, pieceIndex, distancesToBoardEdges, enPassant);
            break;
        case 2:
            return knightAttacks(board, pieceIndex, distancesToBoardEdges);
            break;
        case 3:
            return bishopAttacks(board, pieceIndex, distancesToBoardEdges);
            break;
        case 4:
            return rookAttacks(board, pieceIndex, distancesToBoardEdges);
            break;
        case 5:
            return queenAttacks(board, pieceIndex, distancesToBoardEdges);
            break;
        case 6:
            return kingAttacks(board, pieceIndex, distancesToBoardEdges, castling);
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


const pawnAttacks = (board, pieceIndex, distancesToBoardEdges, enPassant) => {
    let moves = [];
    let color = (getColor(board, pieceIndex) ? -1 : 1);

    moves.push((pieceIndex + (8 * color)) - 1);
    moves.push((pieceIndex + (8 * color)) + 1);

    return moves;

}

const knightAttacks = (board, pieceIndex, distancesToBoardEdges) => {
    let moves = [];

    const localKnightMoves = (distance1, distance2, distance3, moveAmount1, moveAmount2) => {
        if (distance1 >= 2) {
            if (distance2 >= 1)
                moves.push(pieceIndex + moveAmount1);
            if (distance3 >= 1)
                moves.push(pieceIndex + moveAmount2);
        }
    }

    localKnightMoves(distancesToBoardEdges[pieceIndex].upDistance, distancesToBoardEdges[pieceIndex].leftDistance, distancesToBoardEdges[pieceIndex].rightDistance, -17, -15);
    localKnightMoves(distancesToBoardEdges[pieceIndex].leftDistance, distancesToBoardEdges[pieceIndex].upDistance, distancesToBoardEdges[pieceIndex].downDistance, -10, 6);
    localKnightMoves(distancesToBoardEdges[pieceIndex].downDistance, distancesToBoardEdges[pieceIndex].leftDistance, distancesToBoardEdges[pieceIndex].rightDistance, 15, 17);
    localKnightMoves(distancesToBoardEdges[pieceIndex].rightDistance, distancesToBoardEdges[pieceIndex].upDistance, distancesToBoardEdges[pieceIndex].downDistance, -6, 10);
    return moves;
}


const bishopAttacks = (board, pieceIndex, distancesToBoardEdges) => {
    let moves = [];
    const localBishopMoves = (distance1, distance2, moveAmount) => {
        for (let i = 1; i <= Math.min(distance1, distance2); i++) {
            if (!board[pieceIndex + (i * moveAmount)]) {
                moves.push(pieceIndex + (i * moveAmount));
            } else {
                moves.push(pieceIndex + (i * moveAmount));
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


const rookAttacks = (board, pieceIndex, distancesToBoardEdges) => {
    let moves = [];

    const localRookMoves = (distance, moveAmount) => {
        for (let i = 1; i <= distance; i++) {
            if (!board[pieceIndex + (i * moveAmount)]) {
                moves.push(pieceIndex + (i * moveAmount));
            } else {
                moves.push(pieceIndex + (i * moveAmount));
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

const queenAttacks = (board, pieceIndex, distancesToBoardEdges) => {
    let moves = [];
    moves = moves.concat(rookAttacks(board, pieceIndex, distancesToBoardEdges), bishopAttacks(board, pieceIndex, distancesToBoardEdges));
    return moves;
}

const kingAttacks = (board, pieceIndex, distancesToBoardEdges, castling) => {
    let moves = [];
    let [up, left, down, right] = [distancesToBoardEdges[pieceIndex].upDistance >= 1, distancesToBoardEdges[pieceIndex].leftDistance >= 1, distancesToBoardEdges[pieceIndex].downDistance >= 1, distancesToBoardEdges[pieceIndex].rightDistance >= 1];
    if (up) {
        moves.push(pieceIndex - 8);
    }
    if (left) {
        moves.push(pieceIndex - 1);
    }
    if (down) {
        moves.push(pieceIndex + 8);
    }
    if (right) {
        moves.push(pieceIndex + 1);
    }
    if (up && left) {
        moves.push(pieceIndex - 9);
    }
    if (up && right) {
        moves.push(pieceIndex - 7);
    }
    if (down && left) {
        moves.push(pieceIndex + 7);
    }
    if (down && right) {
        moves.push(pieceIndex + 9);
    }
    
    return moves;


}


const getColor = (board, pieceIndex) => {
    return Math.floor(board[pieceIndex] / 10);
}

module.exports = pieceAttacking;