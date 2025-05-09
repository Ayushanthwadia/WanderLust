const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    image: {
        type: String,
         set: (v) => v === "" ? "default link" : v
    },
    price : {
        type : Number,
        min : 1,
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;