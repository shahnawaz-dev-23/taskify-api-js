const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        default: null
    },
    profile_picture: {
        type: String,
        default: null
    },
    date_joined: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

UserSchema.virtual('fullName').get(function () {
    return `${this.first_name} ${this.last_name}`;
});

UserSchema.set('toJSON', { virtuals: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);