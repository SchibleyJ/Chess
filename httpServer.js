//express server
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  app.use(express.static(__dirname + '/public/index'));
  res.sendFile(__dirname + '/public/index/index.html');
});

app.get('/singleplayer', (req, res) => {
  app.use(express.static(__dirname + '/public/single'));
  res.sendFile(__dirname + '/public/single/singleplayer.html');
});

app.get('/online', (req, res) => {
  app.use(express.static(__dirname + '/public/online'));
  res.sendFile(__dirname + '/public/online/online.html');
});

app.get('/computer', (req, res) => { 
  app.use(express.static(__dirname + '/public/bot'));
  res.sendFile(__dirname + '/public/bot/bot.html');
});



/*
app.listen(port, () => {
  console.log("Example app listening at 8080");
});
*/



module.exports = app;

/*
//websocket server 
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081, path: '/transfer' });
const Game = require('./chess/game.js');


let soloGames = [];
let onlineGames = {};

wss.on('connection', (client) => {
  console.log('connected');
  //console.log(userData)
  //client.send(JSON.stringify(["LOGIN", { whitePlayer: !!userData.whitePlayer, blackPlayer: !!userData.blackPlayer }]));
  client.on('message', (e) => {
    let message = JSON.parse(e);
    

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



    //console.log(userData)
    console.log('closed');
    console.log('Number of clients: ', wss.clients.size);
  });

});
*/