const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_DB_LINK, {
    useNewUrlParser: true,
    useCreateIndex: true
});