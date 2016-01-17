var mongo = require('./mongo');

function Db() {
    this.fetchFromDatabase = function(collectionName, query, callBack) {
        mongo.fetchFromDatabase(query, collectionName, function(err, documents) {
            callBack(err, documents);
        });
    };

    this.addToDatabase = function(newItem, collectionName, callBack) {
        mongo.addToDatabase(newItem, collectionName, function(err, result) {
            callBack(err, result);
        });
    };

    this.removeFromDatabase = function(query, collectionName, callBack) {
        mongo.removeFromDatabase(query, collectionName, function(err, result) {
            callBack(err, result);
        });
    };

    this.updateDocument = function(query, data, collectionName, callBack) {
        mongo.updateDocument(query, data, collectionName, function(err, result) {
            callBack(err, result);
        });
    };
}

var mongoDb = new Db();

module.exports = mongoDb;