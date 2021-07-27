// CRUD operations

const { MongoClient, ObjectId } = require("mongodb");

const connUrl = "mongodb://127.0.0.1/:27017";
const databaseName = 'task-manager';
const id = new ObjectId();
console.log("id", id);
console.log("id getTimestamp", id.getTimestamp());

MongoClient.connect(connUrl, { useNewUrlParser: true }, (error, client) => {
	if(error) {
		return console.log("Unable to connect");
	} else {
		const dataBase = client.db(databaseName);

// Delete

	// dataBase.collection('users').deleteMany({
	// 	age: 40
	// }).then((result)=> {
	// 	console.log(result, 'result');
	// }).catch((error)=> {
	// 	console.log('Error', error)
	// });

	// dataBase.collection('tasks').deleteOne({
	// 	description: "Getting a Good Job From Previous Company"
	// }).then((result)=> {
	// 	console.log(result, 'result');
	// }).catch((error)=> {
	// 	console.log('Error', error)
	// });


// Update

	// dataBase.collection('users').updateOne({
	// 	_id: new ObjectId("60f8644e67963df87bcdea51")
	// }, {
	// 	// $set: {
	// 	// 	"age": 15
	// 	// }
	// 	$inc: {
	// 		"age": 5
	// 	}
	// }).then((result)=> {
	// 	console.log(result, 'result');
	// }).catch((error)=> {
	// 	console.log('Error', error)
	// })

	// dataBase.collection('tasks').updateMany({
	// 	completed: false
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }).then((result)=> {
	// 	console.log(result, 'result');
	// }).catch((error)=> {
	// 	console.log('Error', error)
	// })

// Read
		// dataBase.collection('users').findOne({
		// 	_id: new ObjectId("60f8607a8771dde3e6bb60e5")
		// }, (error, result)=> {
		// 	if(error) {
		// 		return console.log("Unable To Fetch User");
		// 	}
		// 	console.log(result, 'result');
		// })

		// dataBase.collection('tasks').findOne({
		// 	_id: new ObjectId("60f8613a0c4f80397699a0e9")
		// }, (error, result)=> {
		// 	if(error) {
		// 		return console.log("Unable To Fetch Task");
		// 	}
		// 	console.log(result);
		// })

		// dataBase.collection('tasks').find({
		// 	completed: false
		// }).toArray((error, result)=> {
		// 	if(error) {
		// 		return console.log("Unable To Fetch Task");
		// 	}
		// 	console.log(result);
		// })

// Create
		// Single Entry
		// dataBase.collection('users').insertOne({
		// 	_id: id,
		// 	name: "Vidhi",
		// 	age: 14
		// }, (error, result)=> {
		// 	if(error) {
		// 		return console.log("Unable to insert result");
		// 	}
		// 	console.log(result, 'result');
		// });

		// Multiple Entry
		// dataBase.collection('users').insertMany([
		// {
		// 	name: "Prachi",
		// 	age: 25
		// },
		// {
		// 	name: "Kala",
		// 	age: 40
		// }
		// ], (error, result)=> {
		// 	if(error) {
		// 		return console.log("Unable to insert result multiple");
		// 	}
		// 	console.log(result.ops, 'result');
		// });

		// Insert 3 Task
		// dataBase.collection('tasks').insertMany([
		// {
		// 	description: "Sleeping Whole Day And Enjoying Life",
		// 	completed: false
		// },
		// {
		// 	description: "Getting a Good Job From Previous Company",
		// 	completed: false
		// },
		// {
		// 	description: 'Completing The Node.js Certification',
		// 	completed: true
		// }
		// ], (error, result)=> {
		// 	if(error) {
		// 		return console.log("Unable to insert result multiple");
		// 	}
		// 	console.log(result, 'result');
		// });
	}
});