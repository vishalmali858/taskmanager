const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/model/Users.js");
const Task = require("../../src/model/Tasks.js");

const userOneId = new mongoose.Types.ObjectId().toString();
const userOne = {
	_id: userOneId,
	name: 'Vishal Mali Test',
	email: "vishalmali858@outlook.com",
	password: "7967VishaL@",
	tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWTSECRETKEY) }]
}

const userTwoId = new mongoose.Types.ObjectId().toString();
const userTwo = {
	_id: userTwoId,
	name: 'Vidhi Mali Test',
	email: "vidhimali@outlook.com",
	password: "9322VishaL@",
	tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWTSECRETKEY) }]
}


const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: '1 task',
	completed: false,
	owner: userOneId
}

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: '2 task',
	completed: false,
	owner: userTwoId
}

const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: '3 task',
	completed: false,
	owner: userTwoId
}

const setUpInitialDatabase = async() => {
	await User.deleteMany();
	await Task.deleteMany();
	const newUserCreated = await new User(userOne) 
	await newUserCreated.save();
	const newUserCreated2 = await new User(userTwo) 
	await newUserCreated2.save();

	const newTaskCreated1 = await new Task(taskOne) 
	await newTaskCreated1.save();
	const newTaskCreated2 = await new Task(taskTwo) 
	await newTaskCreated2.save();
	const newTaskCreated3 = await new Task(taskThree) 
	await newTaskCreated3.save();
}


module.exports = { userOne, userOneId, setUpInitialDatabase, userTwoId, userTwo, taskOne, taskTwo, taskThree }