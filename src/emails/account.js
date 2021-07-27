const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
	to: email,
	from: "vishalmali858@gmail.com",
	subject: "Thanks for joining",
	text: `Welcome to app, ${name} Task Manager is ready to make ur life sorted and relaxed.`
});
}

const userGoingEmail = (email, name) => {
	sgMail.send({
	to: email,
	from: "vishalmali858@gmail.com",
	subject: "This is sad",
	text: `We feel sad to let you go, ${name} . I hope we will meet soon again.`
});
}

module.exports = { sendWelcomeEmail, userGoingEmail };