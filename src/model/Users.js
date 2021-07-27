const mongoose = require('mongoose');
const validator = require('validator');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./Tasks.js')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email id Entered is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("'Password' text should not be added in the password");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error("Negative Age is not possible")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTSECRETKEY , { "expiresIn": "1 day" });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const user = this;
    const userObjToBeSend = user.toObject();
    delete userObjToBeSend.password;
    delete userObjToBeSend.tokens;
    delete userObjToBeSend.avatar;
    return userObjToBeSend
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
    if(email && validator.isEmail(email)) {
        const user = await Users.findOne({ email });
        if(!user) {
            throw new Error('Unable To Login 2')
        }

        const isMatch = await bCrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error('Unable To Login 3')
        }
        return user;
    } else {
        throw new Error('Unable To Login 1')
    }
}

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bCrypt.hash(user.password, 8);
    }
    console.log('save pre hook is called')
    next();
});

userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    console.log('remove pre hook is called')
    next();
});

const Users = mongoose.model('User', userSchema)

// const me = new Users({
//     name: ' Vishal  ',
//     email: 'vishalMALI858@gmail.com',
//     password: '   12345678Pa   '
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!', error)
// })

module.exports = Users;