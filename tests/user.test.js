const supertest = require("supertest");
const app = require("../src/app.js");
const User = require("../src/model/Users.js");
const { userOne, userOneId, setUpInitialDatabase } = require("./fixtures/db.js");

beforeEach(setUpInitialDatabase);


test('Sign Up New User /post', async () => {
	const response = await supertest(app).post('/users').send({
		name: "Vishal Mali Test",
		email: "vishalmali858@gmail.com",
		password: "prachi7967@"
	}).expect(201);
	const userFetched = await User.findById(response.body.user._id);
	expect(userFetched).not.toBeNull();
	expect(response.body).toMatchObject({
		user: {
				name: "Vishal Mali Test",
				email: "vishalmali858@gmail.com"
		},
		token: userFetched.tokens[0].token
	});
	expect(userFetched.password).not.toBe("prachi7967@");
})

test('Check User login', async() => {
	const response = await supertest(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200);
	const userFetched = await User.findById(userOneId);
	expect(response.body.token).toBe(userFetched.tokens[1].token);
})

test('Check User login which dont exist', async() => {
	await supertest(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password + 'abcd'
	}).expect(404);
})

test('Get Profile with token', async() => {
	await supertest(app)
	.get('/users/me')
	.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
	.send()
	.expect(200);
})

test('Get Profile for unauthenticated User', async() => {
	await supertest(app)
	.get('/users/me')
	.send().
	expect(401);
})

// test('Delete Account For User', async() => {
// 	await supertest(app)
// 		.delete('/users/me')
// 		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
// 		.send()
// 		.expect(200);
// 	const userFetched = await User.findById(userOneId);
// 	expect(userFetched).toBeNull();
// });

test('Dont Delete Account For Unauthenticated User', async() => {
	await supertest(app)
		.delete('/users/me')
		.send()
		.expect(401);
});

test('Upload avatar file', async() => {
	await supertest(app)
	.post('/users/me/avatar')
	.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
	.attach('avatar', 'tests/fixtures/profile-pic.jpg')
	.expect(200);

	const userFetched = await User.findById(userOneId);
	expect(userFetched.avatar).toEqual(expect.any(Buffer));
	// expect(userFetched).toBeNull();
})

test('Update user valid fields', async ()=> {
	await supertest(app)
	.patch('/users/me')
	.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
	.send({
		name: "Vishal Update"
	}).expect(200);

	const userFetched = await User.findById(userOneId);
	expect(userFetched.name).toBe("Vishal Update");
});

test('Update user invalid fields', async ()=> {
	await supertest(app)
	.patch('/users/me')
	.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
	.send({
		location: "India"
	}).expect(400);
});

jest.setTimeout(20000);



