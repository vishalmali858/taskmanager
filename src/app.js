const express = require('express');
require('./db/mongoosedb.js');
const bCrypt = require("bcrypt");
const userRouter = require('./routers/users.js');
const taskRouter = require('./routers/tasks.js');
const app = express();

// app.post('/upload', upload.single('upload') , (req, res)=> {
// 	res.send();
// });


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;