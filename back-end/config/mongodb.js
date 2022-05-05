const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env._DB_CONNECT, {
      //useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB is ready: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
