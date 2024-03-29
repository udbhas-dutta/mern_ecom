const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name must have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "User already exists"],
        validate: [validator.isEmail, "Please enter a valid email id"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            rquired: true
        },
        url: {
            type: String,
            requird: true
        }
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
})


//JWT token
userSchema.methods.getJWTToken = function () { //this is a custom made function
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//compare passwords from logged in user with stored user password
userSchema.methods.comparePassword = async function (enteredPassword) { // this is a custom made function
    return await bcrypt.compare(enteredPassword, this.password)
}

//generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and adding resetPassword to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken
}


module.exports = mongoose.model("User", userSchema)