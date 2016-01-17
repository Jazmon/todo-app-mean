var mongodb = require("mongodb"),
	mongoClient = mongodb.MongoClient,
	connection = createConnectionAddress();

/* GET Retrieves data from the mongo database. */
function fetchFromDatabase(query, collectionName, callback) {
	mongoClient.connect(connection.url, function(err, db) {
		if (err) {
			console.error("Error retrieving data from the database!");
			throw err;
		}

		var collection = db.collection(collectionName);
		collection.find(query).toArray(function(err, documents) {
			callback(err, documents);

			db.close();
		});
	});
}

// PUT
function updateDocument(query, data, collectionName, callback) {
	mongoClient.connect(connection.url, function(err, db) {
		if (err) {
			console.error("Error updating data in the database!");
			throw err;
		}

		var collection = db.collection(collectionName);

		data["_id"] = undefined;
		delete data._id;

		collection.update(query, data, function(err, result) {
			callback(err, result);

			db.close();
		});
	});
}

// DELETE
function removeFromDatabase(query, collectionName, callback) {
	mongoClient.connect(connection.url, function(err, db) {
		if (err) {
			console.error("Error removing data from the database!");
			throw err;
		}

		var collection = db.collection(collectionName);
		collection.remove(query, function(err, result) {
			callback(err, result);

			db.close();
		});
	});
}

// POST
function addToDatabase(newDocument, collectionName, callback) {
	mongoClient.connect(connection.url, function(err, db) {
		if (err) {
			console.error("Error adding data to the database!");
			throw err;
		}
		var collection = db.collection(collectionName);
		collection.insert(newDocument, function(err, result) {
			callback(err, result);

			db.close();
		});
	});
}




/* Creates the connection url from different parts */
function createConnectionAddress() {
	var con = {};

	con.protocol = "mongodb";
	con.ip = process.env.IP;
	con.port = "27017";
	con.db = "test";
	con.url = con.protocol + "://" + con.ip + ":" +
		con.port + "/" + con.db;

	return con;
}

exports.addToDatabase = addToDatabase;
exports.fetchFromDatabase = fetchFromDatabase;
exports.updateDocument = updateDocument;
exports.removeFromDatabase = removeFromDatabase;