//websocket server 
const WebSocket = require('ws');
const Game = require('./chess/game.js');
const server = require('http').createServer();
const app = require('./httpServer.js');
const port = process.env.PORT || 8080;

const wss = new WebSocket.Server({ server: server, path: '/transfer' });
let soloGames = [];
let onlineGames = {};

server.on('request', app);

wss.on('connection', (client) => {
    console.log('connected');
    //console.log(userData)
    //client.send(JSON.stringify(["LOGIN", { whitePlayer: !!userData.whitePlayer, blackPlayer: !!userData.blackPlayer }]));
    client.on('message', (e) => {
        let message = JSON.parse(e);
        /*if (message.type == 0){
          client["userData"] = {"username": message.body.name, color: message.body.color, id=userIDNum++};
        }*/

        //game(message, wss, client, userData);
        if (message.messageType == 0) {
            if (message.body.gameType == 0) {
                //console.log(createGame())
                soloGames.push(new Game());
                client["userData"] = { 'gameType': 0, 'gameID': (soloGames.length - 1) };
                soloGames[client.userData.gameID].main(message, wss, client);
            }
            if (message.body.gameType == 1) {
                if (!onlineGames[message.body.gameID]) {
                    onlineGames[message.body.gameID] = new Game(message.body.gameID);
                }
                client["userData"] = { 'gameType': 1, 'gameID': message.body.gameID };
                onlineGames[client.userData.gameID].main(message, wss, client);
            }
        } else {
            if (message.body.gameType == 0) {
                soloGames[client.userData.gameID].main(message, wss, client);
            }
            if (message.body.gameType == 1) {
                onlineGames[client.userData.gameID].main(message, wss, client);
            }
        }

    });
    client.on('close', () => {
        //console.log(client.userData.color);
//test

        //console.log(userData)
        console.log('closed');
        console.log('Number of clients: ', wss.clients.size);
    });

});

server.listen(port, function () {

    console.log(`http/ws server listening on ${port}`);
});