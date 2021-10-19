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

module.exports = app;
