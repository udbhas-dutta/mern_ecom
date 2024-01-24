const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require("crypto")
const cloudinary = require("cloudinary")

//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    })

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: cloudinary.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user, 201, res)
})

//login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //to check if the user both an email and a password

    if (!email || !password) {
        return next(new ErrorHandler("Please enter a valid email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    //if email and passwords match, deliver a jwt token:
    sendToken(user, 200, res)
});

//logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});


//Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get resetPassword token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore.`;

    try {

        await sendEmail({
            email: user.email,
            subject: `mern_ecom password recovery`,
            message
        })
        res.status(200).json({
            succcess: true,
            message: `Email sent to ${user.email} successfully`,
        })


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }

});


//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })


    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords don't match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})

//Get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
})

//Change User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords dont match", 400));
    }

    user.password = req.body.newPassword

    await user.save();

    sendToken(user, 200, res);

})

//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    //TODO : add cloudinary

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})

//Get all users -- Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })
})

//Get all users -- Admin
exports.getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with the following id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user,
    })
})

//Update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})

//Delete User -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    //TODO : remove cloudinary

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

