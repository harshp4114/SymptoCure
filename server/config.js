const mongoose = require("mongoose");
async function connectMongo() {
  await mongoose
    .connect("mongodb+srv://harshpatadia4114:harshp@@@@4114@symptocure.criql.mongodb.net/?retryWrites=true&w=majority&appName=Symptocure")
    .then(() => {
      //console.log("srever connected to mongo successfully");
    })
    .catch((error) => {
      //console.log("error connecting to mongo",error);
    });
}

module.exports = { connectMongo };
