const mongoose=require("mongoose");
async function connectMongo(){
    await mongoose.connect("mongodb://localhost:27017/sympto-cure").then(()=>{
        console.log("srever connected to mongo successfully");
    });
}

module.exports={connectMongo};