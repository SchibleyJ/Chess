let color;
let gameCanvas = document.getElementById("gameCanvas");
let board = [];
//let sse = new EventSource('/stream');
let prevCaptures;
//let whiteTurnClock = [true, false];

const ws = new WebSocket(`ws${location.protocol == "https:" ? 's' : ''}://${location.host}/transfer`);

//login 
ws.onopen = () => {
    //document.getElementById('parent').classList.add('hidden')
    //ws.send(JSON.stringify({ type: 0, body: name}))
};

const login = () => {
    let name = document.getElementById("username").value;
    if (color !== undefined && name !== "") {
        ws.send(JSON.stringify({ messageType: 3, body: { gameType: 1, name: name, color: color } }));
        document.getElementById('parent').classList.remove('hidden');
        document.getElementById('login').classList.add('hidden');
    }
}


const setColor = (newColor) => {
    if (newColor) {
        document.getElementById('colorSelectBlack').classList.add('colorSelectOutline');
        document.getElementById('colorSelectWhite').classList.remove('colorSelectOutline');
    } else {
        document.getElementById('colorSelectBlack').classList.remove('colorSelectOutline');
        document.getElementById('colorSelectWhite').classList.add('colorSelectOutline');
    }
    color = newColor;
}
//

const joinLobby = (code) => {
    console.log(code);
    document.getElementById('lobbySelect').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');

    ws.send(JSON.stringify({ messageType: 0, body: { gameType: 1, gameID: code } }));

}


ws.onmessage = (e) => {
    //console.log(e)
    let data = JSON.parse(e.data);
    if (data[0] == "LOGIN") {
        console.log(JSON.stringify(data[1]))
        if (data[1].whitePlayer) {
            document.getElementById('colorSelectWhite').classList.add('hidden');
            //document.getElementById('white').classList.add('hidden');
        }
        if (data[1].blackPlayer) {
            console.log('here')
            document.getElementById('colorSelectBlack').classList.add('hidden');
            // document.getElementById('black').classList.add('hidden');
        }
        if (data[1].whitePlayer && data[1].blackPlayer) {
            document.getElementById("username").value = 'spectator';
            color = 2;
            login();
        }
    } else {
        board = data[0];
        //whiteTurnClock[0] = data[1]

        if (JSON.stringify(prevCaptures) !== JSON.stringify(data[4])) {
            prevCaptures = data[4];
            updateCaptures(data[4]);
        }
        console.log(data[3]);
        console.log(!data[3].length);
        if (!data[3].length) {
            console.log('here')
            drawBoard(board, data[1], data[2], data[5], data[6]);
        } else {
            updateBoard(board, data[1], data[2], data[3], data[5]);
        }
    }
}


const drawBoard = (board, whiteTurn, gameResult, lastMove, names) => {
    console.log(names);
    if (names.whitePlayer) {

        document.getElementById('userName1').innerHTML = names?.whitePlayer;
    } else {
        document.getElementById('userName1').innerHTML = "Player 1";
    }
    if (names.blackPlayer) {
        document.getElementById('userName2').innerHTML = names?.blackPlayer;
    } else {
        document.getElementById('userName2').innerHTML = "Player 2";
    }

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
        if (lastMove && lastMove.length) {
            for (let k = 0; k < 2; k++) {
                if (lastMove[k][0] % 2 !== lastMove[k][1] % 2) {
                    ctx.fillStyle = '#709090';
                    ctx.fillRect(lastMove[k][0] * 100, lastMove[k][1] * 100, 100, 100);
                } else {
                    ctx.fillStyle = '#9aadad';
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
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j]) {
                let tempImg = new Image;
                tempImg.src = "/img/" + board[i][j].image;
                //console.log(tempImg.src);
                tempImg.onload = () => {
                    ctx.drawImage(tempImg, (j * 100) + 7, (i * 100) + 7, 80, 80);
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
        ctx.clearRect(updateSquares[i][0] * 100, updateSquares[i][1] * 100, 100, 100);
        if (updateSquares[i][0] % 2 != updateSquares[i][1] % 2) {
            ctx.fillStyle = 'slategray';
            ctx.fillRect(updateSquares[i][0] * 100, updateSquares[i][1] * 100, 100, 100)
        }

        //last move squares
        if (lastMove && lastMove.length) {
            for (let k = 0; k < 2; k++) {
                if (lastMove[k][0] % 2 !== lastMove[k][1] % 2) {
                    ctx.fillStyle = '#709090';
                    ctx.fillRect(lastMove[k][0] * 100, lastMove[k][1] * 100, 100, 100);
                } else {
                    ctx.fillStyle = '#9aadad';
                    ctx.fillRect(lastMove[k][0] * 100, lastMove[k][1] * 100, 100, 100);
                }
            }
        }
        //

        ctx.fillStyle = 'black';
        if (updateSquares[i][0] == 0) {
            ctx.fillText(8 - updateSquares[i][1], 5, updateSquares[i][1] * 100 + 25);;
        }
        if (updateSquares[i][1] == 7) {
            ctx.fillText(String.fromCharCode((updateSquares[i][0] + 97)), (updateSquares[i][0] * 100) + 80, 793);
        }
        ctx.stroke;

        if (board[updateSquares[i][1]][updateSquares[i][0]]) {
            let tempImg = new Image;
            tempImg.src = "/img/" + board[updateSquares[i][1]][updateSquares[i][0]].image;
            tempImg.onload = () => {
                ctx.drawImage(tempImg, (updateSquares[i][0] * 100) + 7, (updateSquares[i][1] * 100) + 7, 80, 80);
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
        piece = Math.floor(mouseX / 100) + "" + (Math.floor(mouseY / 100));
        console.log(piece);

        if (piece[1] < 8 && piece[1] > -1 && piece[0] < 8 && piece[0] > -1 && board[piece[1]][piece[0]] !== 0) {
            holdingPiece = !holdingPiece;
        }
    } else {
        holdingPiece = !holdingPiece;
        let moveTo = Math.floor(mouseX / 100) + "" + (Math.floor(mouseY / 100));
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
        messageType: 1,
        body: {
            gameType: 1,
            piece: piece,
            move: moveTo
        }
    }));/*
    fetch('/move', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            piece: piece,
            move: moveTo,
        })
    })
        .then(function (data) {
            //console.log('Request success: ', data);
        })
        .catch(function (error) {
            console.log('Request failure: ', error);
        });*/
}

const resetGame = () => {
    //2 = reset
    if (color == 1 || color == 2) {
        ws.send(JSON.stringify({ messageType: 2, body: {} }));
    }
    /*fetch('/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/html'
        },
        body: '',

    })
        .then(function (data) {
            //console.log('Request success: ', data);
        })
        .catch(function (error) {
            console.log('Request failure: ', error);
        });*/
}
/*
let time1 = 59;
let time2 = 59;
setInterval( () => {
    if (whiteTurnClock[1])
    whiteTurnClock[0] ? document.getElementById('clock1').innerHTML = time1-- : document.getElementById('clock2').innerHTML = time2--;
}, 1000);*/
//kill me
/*
if (window.innerHeight > window.innerWidth) {
    console.log(window.getComputedStyle(document.body).getPropertyValue('margin'));
    document.getElementById('game').style.width = window.innerWidth - 2 * window.getComputedStyle(document.body).getPropertyValue('margin')[0];;
    document.getElementById('game').style.height = window.innerWidth - 2 * window.getComputedStyle(document.body).getPropertyValue('margin')[0];;
} else {
    document.getElementById('game').style.width = window.innerHeight - (200);
    document.getElementById('game').style.height = window.innerHeight - (200);
}
*/

