const jwt = require("jsonwebtoken");
const Users = require("../model/Users");
const authentication = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decodedToken = jwt.verify(token, process.env.JWTSECRETKEY);
		const user = await Users.findOne({ _id: decodedToken._id, "tokens.token": token });
		if(!user) {
			throw new Error();
		}
		req.token = token;
		req.user = user;
		next();
	} catch(e) {
		res.status(401).send({ error: "Please Authenticate"});
	}
};

module.exports = authentication;