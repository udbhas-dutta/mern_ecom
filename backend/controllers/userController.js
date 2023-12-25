const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require("crypto")

//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id of the avatar",
            url: "profilePicUrl"
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

    
    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Passwords don't match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})
