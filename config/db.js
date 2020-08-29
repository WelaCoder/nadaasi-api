const mongoose = require("mongoose");
const config = require("config");
const seed = require("../seed");
const db = config.get("MongoURL");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Database connected ....");
    // seed();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
