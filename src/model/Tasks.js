const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        default: false,
        type: Boolean,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});


taskSchema.pre('save', async function(next) {
    const tasks = this;
    // await tasks.save();
    console.log('save pre hook is called')
    next();
});


const Tasks = mongoose.model('Task', taskSchema);

// const me = new Task({
//     description: '  Complete The certification    ',
//     completed: true
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!', error)
// })

module.exports = Tasks;