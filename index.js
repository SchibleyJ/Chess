//websocket server 
const WebSocket = require('ws');
const SingleGame = require('./chess/singleGame.js');
const OnlineGame = require('./chess/onlineGame.js');
const BotGame = require('./chess/botGame.js');
const server = require('http').createServer();
const app = require('./httpServer.js');
const port = process.env.PORT || 8080;

const wss = new WebSocket.Server({ server: server, path: '/transfer' });
let singleGames = [];
let onlineGames = {};
let botGames = [];

server.on('request', app);

wss.on('connection', (client) => {
    console.log('connected');
    client.on('message', (e) => {
        let message = JSON.parse(e);

        switch (message.gameType) {
            //single player game
            case 0:
                switch (message.messageType) {
                    case 0:
                        singleGames.push(new SingleGame());
                        client["userData"] = { 'gameType': 0, 'gameID': (singleGames.length - 1) };
                        singleGames[client.userData.gameID].create(client);
                        break;
                    case 1:
                        singleGames[client.userData.gameID].move(message, client);
                        break;
                    case 2:
                        singleGames[client.userData.gameID].reset(client);
                        break;
                }
                break;
            //online game
            
            case 1:
                switch (message.messageType) {
                    case 0:
                        if (!onlineGames[message.body.gameID]) {
                            onlineGames[message.body.gameID] = new OnlineGame(message.body.gameID);
                        }
                        client["userData"] = { 'gameType': 1, 'gameID': message.body.gameID };
                        onlineGames[client.userData.gameID].create(client);
                        break;
                    case 1:
                        onlineGames[client.userData.gameID].move(message, wss, client);
                        break;
                    case 2:
                        onlineGames[client.userData.gameID].reset(wss, client);
                        break;

                    case 3:
                        onlineGames[client.userData.gameID].login(message, wss, client);
                        break;
                }
            //bot game
           
            case 2:
                switch (message.messageType) {
                    case 0:
                        botGames.push(new BotGame());
                        client["userData"] = { 'gameType': 2, 'gameID': (botGames.length - 1), color: message.body.color, 'name': 'You' };
                        botGames[client.userData.gameID].create(client);
                        break;
                    case 1:
                        botGames[client.userData.gameID].move(message, client, false);
                        break;
                    case 2:
                        botGames[client.userData.gameID].reset(client);
                        break;
                }

        }

    })
    client.on('close', () => {
        if (client.useData && client.userData.gameType == 1 && client.userData.color !== 2) {
            if (client.userData.color == 0) {
                onlineGames[client.userData.gameID].playerData.whitePlayer = undefined;
            }
            if (client.userData.color == 1) {
                onlineGames[client.userData.gameID].playerData.blackPlayer = undefined;
            }
            onlineGames[client.userData.gameID].reloadBoard(wss, client.userData.color);
        }


        console.log('closed');
        console.log('Number of clients: ', wss.clients.size);
    });
});



server.listen(port, function () {
    console.log(`http/ws server listening on ${port}`);
});