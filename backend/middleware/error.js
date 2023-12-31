const ErrorHandler = require('../utils/errorhandler');
const Error = require('../utils/errorhandler')


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //wrong mongodb id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400)
    }

    //Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    //Wrong JWT token error
    if(err.name === "JsonWebTokenEror"){
        const message = `JSON Web Token is invalid, try again`;
        err = new ErrorHandler(message, 400)
    }

    //JWT expire error
    if(err.name === "TokenExpiredEror"){
        const message = `JSON Web Token has Expired, try again`;
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    }); 


};