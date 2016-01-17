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

var address = createConnectionAddress();
module.exports = {

	'secret': 'holyripperinoinpepperoni',
	'database': address.url

};