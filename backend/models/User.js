// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: { type: String, required: true }, // Phone field
//     role: { type: String, default: 'user' }, // Role field with default value
//     wishlist: [{ // Wishlist field
//         _id: mongoose.Schema.Types.ObjectId,
//         title: String,
//         author: String,
//         category: String,
//         image: String, // Include image if necessary
//         dateAdded: { type: Date, default: Date.now },
//     }],
// });


// const User = mongoose.model('User', userSchema);
// module.exports = User;




const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }, // Phone field
    role: { type: String, default: 'user' }, // Role field with default value
    wishlist: [{ // Wishlist field
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        author: String,
        category: String,
        image: String, // Include image if necessary
        dateAdded: { type: Date, default: Date.now },
    }],
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
