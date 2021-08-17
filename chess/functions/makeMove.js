const makeMove = (body, board, whiteTurn, enPassantSquare, canCastle) => {
    let Queen = require('./pieces/queen.js');
    let getAttacked = require('./getAttacked.js');
    let pseudoLegalCheck = require('./pseudoLegalCheck.js');
    let gameEndCheck = require('./gameEndCheck.js')
    let moveX = parseInt(body.move[0]);
    let moveY = parseInt(body.move[1]);
    let pieceX = parseInt(body.piece[0]);
    let pieceY = parseInt(body.piece[1]);
    let updateSquares = [];
    // moveResponse is formatted as [piece, wasEnPassant, castleIndex, pieceCaptured]
    // piece is a piece string for logic
    // wasEnPassant is a boolean, used to know whether to replace the "passed" pawn on the board
    // castleIndex is an int 0-3 which allows an index in canCastle to be set to false
    // castleRook is a character string of the old and new positions of a rook after a castle 
    // pieceCaptured is a piece string for logic use and later scoring

    // if move was illegal, moveResponse will simply be false
    let moveResponse = board[pieceY][pieceX].isLegalMove(board, pieceX, pieceY, moveX, moveY, enPassantSquare, canCastle);
    //console.log(board);
    if (
        board[pieceY][pieceX].isWhite == whiteTurn &&
        moveResponse &&
        pseudoLegalCheck(board, moveResponse, whiteTurn, pieceX, pieceY, moveX, moveY)
    ) {
        updateSquares.push([moveX, moveY], [pieceX, pieceY]);

        if (board[pieceY][pieceX].piece == "pawn") {
            board[pieceY][pieceX].hasMoved = true;
        }

        board[moveY][moveX] = board[pieceY][pieceX];
        board[pieceY][pieceX] = 0;

        canCastle[moveResponse[2]] = false;

        if (moveResponse[0] == "pawn" && moveY == (whiteTurn ? 0 : 7)) {
            board[moveY][moveX] = new Queen(whiteTurn);
        }

        if (moveResponse[1]) {
            //console.log(moveY + (whiteTurn ? 1 : -1))
            board[moveY + (whiteTurn ? 1 : -1)][moveX] = 0;
            updateSquares.push([moveX, moveY + (whiteTurn ? 1 : -1)]);
        }

        if (moveResponse[0] == "pawn" && Math.abs(moveY - pieceY) == 2) {
            enPassantSquare = [moveX, moveY + (whiteTurn ? 1 : -1)];
        } else {
            enPassantSquare = [];
        }
        //console.log(enPassantSquare)
        if (moveResponse[0] == "king") {
            if (moveResponse[3]) {
                board[moveResponse[3][3]][moveResponse[3][2]] = board[moveResponse[3][1]][moveResponse[3][0]];
                board[moveResponse[3][1]][moveResponse[3][0]] = 0;
                updateSquares.push([parseInt(moveResponse[3][0]), parseInt(moveResponse[3][1])], [parseInt(moveResponse[3][2]), parseInt(moveResponse[3][3])]);
            }
            canCastle[0 + (whiteTurn ? 0 : 2)] = false;
            canCastle[1 + (whiteTurn ? 0 : 2)] = false;
        }


        whiteTurn = !whiteTurn;
        console.log(pieceX + " " + pieceY + " to " + moveX + " " + moveY);

        let moves = gameEndCheck(board, whiteTurn, enPassantSquare, canCastle)

        let attackedMoves = getAttacked(board, !whiteTurn);
        //result returns to index.js and is used to update game state and send to front end
        //formatted as: endString, enPassantSquare, updateSquares, piece
        //enPassantSquare updates the enPassantSquare variable in index.js
        //endString is the result of a game-end check, either empty string, checkmate, or stalemate
        //updateSquares is an array of squares which will be redrawn one the response is sent to the front end
        //piece is a string of a potential piece captured, starting with a capital for use in frontend
        let result = [enPassantSquare, "", updateSquares, moveResponse[4] ? moveResponse[4].charAt(0).toUpperCase() + moveResponse[4].slice(1) : undefined, [[moveX, moveY], [pieceX, pieceY]]];
        if (moves.length == 0) {
            let getKingPos = () => {
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        if (board[i][j].piece == "king" && board[i][j].isWhite == whiteTurn) {
                            return j + "" + i;
                        }
                    }
                }
            }
            kingPos = getKingPos();
            if (attackedMoves.includes(kingPos)) {
                result[1] = "CHECKMATE";
            } else {
                result[1] = "STALEMATE";
            }
        }
        //top return can be used for testing if index.html is updated
        //return [attackedMoves, moves, result];
        return result;
    }
    return false;
}

module.exports = makeMove;