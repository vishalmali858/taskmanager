const supertest = require("supertest");
const app = require("../src/app.js");
const User = require("../src/model/Users.js");
const Task = require("../src/model/Tasks.js");
const { userOne, userOneId, setUpInitialDatabase, userTwoId, userTwo, taskOne, taskTwo, taskThree } = require("./fixtures/db.js");

beforeEach(setUpInitialDatabase);


test('Create Task', async ()=> {
	const response = await supertest(app)
	.post('/tasks')
	.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
	.send({
		description: "Hi, this is my first task using automation",
		owner: userOneId
	}).expect(201);
	const taskFetched = await Task.findById(response.body._id);
	expect(taskFetched).not.toBeNull();
	expect(taskFetched.completed).toBe(false);
})

test('Fectch user task', async ()=> {
	const response = await supertest(app)
	.get('/tasks')
	.set('Authorization', 'Bearer ' + userOne.tokens[0].token).send()
	.expect(200);
	expect(response.body.length).toBe(1);
})

test('Delete User 1 one task from user 2 login', async ()=> {
	const response = await supertest(app)
	.delete('/tasks/' + taskOne._id)
	.set('Authorization', 'Bearer ' + userTwo.tokens[0].token).send()
	.expect(404);
	const taskFetched = await Task.findById(taskOne._id);
	expect(taskFetched).not.toBeNull();
})