var settings = require('../setting')
  , MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server;

module.exports = new MongoClient(new Server('localhost', 27017));