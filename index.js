const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Listing = require("./models/listings.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilities/wrapAsync.js");
const ExpressError = require("./utilities/expressErrors.js");

const app = express();

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
    console.log("Connected to Databse");
}).catch((err)=>{
    console.log(err)
})

app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.engine("ejs",ejsMate);

app.listen(8080,()=>{
    console.log("Listening to port 8080");
});

// View Listings
app.get("/listings",async (req,res)=>{
    let listings = await Listing.find();
    res.render("listings",{listings});
});

// New Listing Form
app.get("/listings/new",(req,res)=>{
    res.render("new");
});

// CREATE Route
app.post("/listings",wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
}));


// SHOW Route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("show",{listing})
});

// EDIT Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("edit",{listing})
});

// UPDATE Route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

// DELETE Route
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render("./layouts/error.ejs",{message});
});


