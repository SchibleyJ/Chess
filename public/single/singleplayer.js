let gameCanvas = document.getElementById("gameCanvas");
let board = [];
//let sse = new EventSource('/stream');
let prevCaptures;
//let whiteTurnClock = [true, false];

const ws = new WebSocket(`ws${location.protocol == "https:" ? 's' : ''}://${location.host}/transfer`);

//login 
ws.onopen = () => {
    //document.getElementById('parent').classList.add('hidden')
    ws.send(JSON.stringify({ gameType: 0, messageType: 0, body: {} }));
};



ws.onmessage = (e) => {
    //console.log(e)
    let data = JSON.parse(e.data);
    console.log(data)
    board = data.board;
    //whiteTurnClock[0] = data[1]

    if (JSON.stringify(prevCaptures) !== JSON.stringify(data.captures)) {
        prevCaptures = data.captures;
        updateCaptures(data.captures);
    }
    //console.log(!data[3].length);
    if (!data.recentMove[0]) {
        console.log('here1')
        drawBoard(board, data.whiteTurn, data.endString, data.recentMove);
    } else {

        updateBoard(board, data.whiteTurn, data.endString, data.updateSquares, data.recentMove);
    }

}


const drawBoard = (board, whiteTurn, gameResult, lastMove) => {


    document.getElementById("infoP").innerHTML = gameResult.length ? gameResult : (whiteTurn ? "White's turn" : "Black's turn");

    //draw board and coordinates
    const ctx = gameCanvas.getContext('2d');
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.font = "20px Arial";
    for (let i = 0; i < gameCanvas.height; i += 100) {
        for (let j = 100; j < gameCanvas.width; j += 200) {
            ctx.fillStyle = 'slategray';
            ctx.fillRect(j - (i % 200), i, 100, 100);
        }

        //last move squares
        if (lastMove && lastMove[0]) {
            console.log('here2')
            for (let k = 0; k < 2; k++) {
                if (lastMove[k][0] % 2 != lastMove[k][1] % 2) {
                    ctx.fillStyle = '#709090';
                    ctx.fillRect(lastMove[k][0] * 100, lastMove[k][1] * 100, 100, 100);
                } else {
                    ctx.fillStyle = '#94a6a6';
                    ctx.fillRect(lastMove[k][0] * 100, lastMove[k][1] * 100, 100, 100);
                }
            }
        }
        //

        ctx.fillStyle = 'black';
        ctx.fillText("" + (9 - (i / 100 + 1)), 5, i + 25);
        if (i == 700) {
            for (let j = 0; j < 8; j++) {
                ctx.fillText(String.fromCharCode((j + 97)), (j * 100) + 80, 793);
            }
        }
    }
    ctx.stroke;

    //draw pieces
    for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
            if (board[file * 8 + rank]) {
                let tempImg = new Image;
                tempImg.src = "/img/" + getImageFromIndex(board, file * 8 + rank);
                //console.log(tempImg.src);
                tempImg.onload = () => {
                    ctx.drawImage(tempImg, (rank * 100) + 7, (file * 100) + 7, 80, 80);
                }

            }
        }
    }
}

const updateBoard = (board, whiteTurn, gameResult, updateSquares, lastMove) => {
    //whiteTurnClock[1] = true;
    document.getElementById("infoP").innerHTML = gameResult.length ? gameResult : (whiteTurn ? "White's turn" : "Black's turn");

    //update each update square, including redrawing color, coordinate, and piece image
    const ctx = gameCanvas.getContext('2d');
    for (let i = 0; i < updateSquares.length; i++) {
        let pos = getXYfromIndex(updateSquares[i]);
        console.log(pos.x, pos.y)
        ctx.clearRect(pos.x * 100, pos.y * 100, 100, 100);
        if (pos.x % 2 != pos.y % 2) {
            ctx.fillStyle = 'slategray';
            ctx.fillRect(pos.x * 100, pos.y * 100, 100, 100)
        }

        //last move squares
        if (lastMove && lastMove.length) {
            for (let k = 0; k < 2; k++) {
                let pos2 = getXYfromIndex(lastMove[k])
                if (pos2.x % 2 !== pos2.y % 2) {
                    ctx.fillStyle = '#709090';
                    ctx.fillRect(pos2.x * 100, pos2.y * 100, 100, 100);
                } else {
                    ctx.fillStyle = '#9aadad';
                    ctx.fillRect(pos2.x * 100, pos2.y * 100, 100, 100);
                }
            }
        }
        //

        ctx.fillStyle = 'black';
        if (pos.x == 0) {
            ctx.fillText(8 - pos.y, 5, pos.y * 100 + 25);;
        }
        if (pos.y == 7) {
            ctx.fillText(String.fromCharCode((pos.x + 97)), (pos.x * 100) + 80, 793);
        }
        ctx.stroke;

        if (board[updateSquares[i]]) {
            let tempImg = new Image;
            tempImg.src = "/img/" + getImageFromIndex(board, updateSquares[i]);
            tempImg.onload = () => {
                ctx.drawImage(tempImg, (pos.x * 100) + 7, (pos.y * 100) + 7, 80, 80);
            }
        }
    }

}

const updateCaptures = (captures) => {
    let captures1 = document.getElementById('player1captures');
    let captures2 = document.getElementById('player2captures');
    let ctx1 = captures1.getContext('2d');
    let ctx2 = captures2.getContext('2d');
    ctx1.clearRect(0, 0, captures1.width, captures1.height);
    ctx2.clearRect(0, 0, captures2.width, captures2.height);
    const drawImage = (ctx, offset, image, i) => {
        image.onload = () => {
            console.log(offset, image.src);
            ctx.drawImage(image, (i * 15) + offset, 0, 50, 50);
        }
    }

    let offset = 0;
    for (let type in captures['white']) {
        if (captures['white'][type]) {
            offset += 45;
        }
        for (let i = 0; i < captures['white'][type]; i++) {
            let tempImg = new Image;
            tempImg.src = "/img/blackInverse/black" + type + ".png";
            drawImage(ctx1, offset, tempImg, i);
        }
    }
    offset = 0;
    for (let type in captures['black']) {
        if (captures['white'][type]) {
            offset += 45;
        }
        for (let i = 0; i < captures['black'][type]; i++) {
            let tempImg = new Image;
            tempImg.src = "/img/white" + type + ".png";
            drawImage(ctx2, offset, tempImg, i);
        }
    }

}

let holdingPiece = false;
let piece;
gameCanvas.addEventListener('mousedown', (event) => {
    //calculate mouseX and mouseY pos
    let rect = gameCanvas.getBoundingClientRect(); // abs. size of element
    let scaleX = gameCanvas.width / rect.width;    // relationship bitmap vs. element for X
    let scaleY = gameCanvas.height / rect.height;  // relationship bitmap vs. element for Y
    let mouseX = (event.clientX - rect.left) * scaleX;   // scale mouse coordinates after they have
    let mouseY = (event.clientY - rect.top) * scaleY;     // been adjusted to be relative to element


    if (!holdingPiece) {
        piece = [Math.floor(mouseX / 100), (Math.floor(mouseY / 100))];
        console.log(piece);

        if (piece[1] < 8 && piece[1] > -1 && piece[0] < 8 && piece[0] > -1 && board[8 * piece[1] + piece[0]]) {
            holdingPiece = !holdingPiece;
        }
    } else {
        holdingPiece = !holdingPiece;
        let moveTo = [Math.floor(mouseX / 100), (Math.floor(mouseY / 100))];
        console.log("mt" + moveTo);
        if (moveTo[1] < 8 && moveTo[1] > -1 && moveTo[0] < 8 && moveTo[0] > -1) {
            //if (board[piece[1]][piece[0]].isWhite === userIsWhite || userIsWhite === "either") {
            sendMove(piece, moveTo);
            //}
        }
    }
});


const sendMove = (piece, moveTo) => {
    ws.send(JSON.stringify({
        //1 = move
        gameType: 0,
        messageType: 1,
        body: {
            moveFrom: (8 * piece[1] + piece[0]),
            moveTo: (8 * moveTo[1] + moveTo[0])
        }
    }));
}

const resetGame = () => {
    //2 = reset
    ws.send(JSON.stringify({ gameType: 0, messageType: 2, body: {} }));

}


const getImageFromIndex = (board, index) => {
    //console.log(`${Math.floor(board[index] / 10) ? "white" : "black"}${getPieceType(board[index])}.png`)
    return `${Math.floor(board[index] / 10) ? "white" : "black"}`
        + `${getPieceType(board[index])}.png`
}

const getPieceType = (piece) => {
    //console.log(piece)
    switch (piece % 10) {
        case 1:
            return "Pawn";
            break;
        case 2:
            return "Knight";
            break;
        case 3:
            return "Bishop";
            break;
        case 4:
            return "Rook";
            break;
        case 5:
            return "Queen";
            break;
        case 6:
            return "King";
            break;
    }
}

const getXYfromIndex = (index) => {
    return {
        "x": index % 8,
        "y": (Math.floor(index / 8))
    }
}