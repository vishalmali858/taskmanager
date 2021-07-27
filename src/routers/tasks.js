const express = require('express');
const router = new express.Router();
const Tasks = require('../model/Tasks');
const authentication = require("../middleware/authentication")

router.get('/tasks', authentication, async (req, res) => {
	const match = {};
	const sort = {};
	if(req.query.hasOwnProperty('completed')) {
		match.completed = req.query.completed === "true";
	}
	if(req.query.hasOwnProperty('sortBy')) {
		const paginationSort = req.query.sortBy.split(":");
		sort[paginationSort[0]] = (sort[paginationSort[1]] === 'desc' ? -1 : 1 );
	}
	try {
		// const tasks = await Tasks.find({ });
		await req.user.populate({
			path: 'tasks',
			match,
			options: {
				limit: parseInt(req.query.limit),
				skip: parseInt(req.query.skip),
				sort
			}
		}).execPopulate();
		res.send(req.user.tasks)
	} catch(error) {
		res.status(500).send(error);
	}
});

router.get('/tasks/:id', authentication, async (req, res) => {
	try {
		// const tasks = await Tasks.findById(req.params.id);
		const tasks = await Tasks.findOne({ _id: req.params.id, owner: req.user._id.toString() });
		if(!tasks) {
			return res.status(404).send();
		}
		res.send(tasks)
	} catch(error) {
		res.status(500).send(error);
	}
});


router.post('/tasks', authentication, async (req, res)=> {
	try {
		const tasks = new Tasks({...req.body, owner: req.user._id });
		await tasks.save();
		res.status(201).send(tasks)
	} catch(error) {
		res.status(400).send(error);
	}
});

router.patch('/tasks/:id', authentication, async(req, res) => {
	const keysInput = Object.keys(req.body);
	const allowedUpdate = ["description", "completed"];
	const isValid = keysInput.every((data) => allowedUpdate.includes(data));
	if(!isValid) {
		return res.status(400).send({ error: "Invalid Field Added" });
	}
	try {
		const tasks = await Tasks.findOne({ _id: req.params.id, owner: req.user._id.toString() });
		// let tasks = await Tasks.findById(req.params.id);
		// let tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if(!tasks) {
			return res.status(404).send();
		}
		keysInput.forEach((keysData)=> tasks[keysData] = req.body[keysData]);
		await tasks.save();
		res.send(tasks)
	} catch(error) {
		res.status(500).send(error);
	}
});

router.delete('/tasks/:id', authentication, async(req, res) => {
	try {
		const tasks = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id.toString() });
		// let tasks = await Tasks.findByIdAndDelete(req.params.id);
		if(!tasks) {
			return res.status(404).send();
		}
		res.send(tasks)
	} catch(error) {
		res.status(500).send(error);
	}
});

module.exports = router;