const express = require('express');
const router = new express.Router();
const Users = require('../model/Users');
const authentication = require('../middleware/authentication');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, userGoingEmail } = require('../emails/account');

const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("File must be an jpg or jpeg or png"))
		}
		cb(undefined, true);
	}
});

router.post('/users', async (req, res)=> {
	const user = new Users(req.body);
	try {
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch(error) {
		res.status(400).send(error);
	}
});

router.post('/users/login', async(req, res) => {
	try {
		const user = await Users.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		// res.send({ user: user.getPublicProfile(), token });
		res.send({ user, token });
	} catch(e) {
		return res.status(404).send(e);
	}
});

router.post('/users/logout', authentication, async(req, res) => { 
	try {
		req.user.tokens = req.user.tokens.filter((token)=> {
			return token.token !== req.token;
		})

		await req.user.save();
		res.status(200).send();
	} catch(e) {
		return res.status(500).send();
	}
});

router.post('/users/logoutall', authentication, async(req, res) => { 
	try {
		req.user.tokens = [];

		await req.user.save();
		res.send();
	} catch(e) {
		return res.status(500).send();
	}
});

// All users
// router.get('/users', authentication ,async (req, res) => {
// 	try {
// 		let users = await Users.find({ })
// 		res.send(users)
// 	} catch(error) {
// 		res.status(500).send(error);
// 	}
// });

router.get('/users/me', authentication ,async (req, res) => {
	res.send(req.user);
});

// router.get('/users/:id', async (req, res) => {
// 	try {
// 		let users = await Users.findById(req.params.id)
// 		if(!users) {
// 			return res.status(404).send();
// 		}
// 		res.send(users)
// 	} catch(error) {
// 		res.status(500).send(error);
// 	}
// });

router.delete('/users/me', authentication, async(req, res) => {
	try {
		// let users = await Users.findByIdAndDelete(req.user._id.toString());
		// if(!users) {
		// 	return res.status(404).send();
		// }
		await req.user.remove();
		userGoingEmail(req.user.email, req.user.name);
		res.send(req.user)
	} catch(error) {
		res.status(500).send(error);
	}
});

router.patch('/users/me', authentication, async(req, res) => {
	const keysInput = Object.keys(req.body);
	const allowedUpdate = ["name", "email", "age", "password"];
	const isValid = keysInput.every((data) => allowedUpdate.includes(data));
	if(!isValid) {
		return res.status(400).send({ error: "Invalid Field Added" });
	}
	try {
		// let usersReturn = await Users.findById(req.params.id);
		let usersReturn = req.user;
		// if(!usersReturn) {
		// 	return res.status(404).send();
		// }
		keysInput.forEach((keysData) => {
			usersReturn[keysData] = req.body[keysData]
		});
		// let usersReturn = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		await usersReturn.save();
		res.send(usersReturn);
	} catch(error) {
		res.status(500).send(error);
	}
});

router.post('/users/me/avatar', authentication, upload.single('avatar'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({ wisth: 250, height: 250}).png().toBuffer();
	req.user.avatar = buffer;
	await req.user.save();
	res.send("Image Uploaded");
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message });
})

router.delete('/users/me/avatar', authentication, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send("Image Deleted");
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message });
})

router.get('/users/:id/avatar', async(req, res) => {
	try {
		const user = await Users.findById(req.params.id);
		if(!user || !user.avatar) {
			throw new Error('No user found or avatar found');
		}
		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch(e) {
		res.status(404).send(e);
	}
});

module.exports = router;