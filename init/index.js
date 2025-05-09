const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
    console.log("Connected to Database");
}).catch((err)=>{
    console.log(err);
})

async function init(){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data saved successfully")
}

init()