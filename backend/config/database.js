const mongoose = require("mongoose");


const connectDatabase = async() => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI) 
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDatabase;