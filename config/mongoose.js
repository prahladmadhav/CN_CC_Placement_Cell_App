const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/prahladmadhav_placement_cell_app");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to the MongoDB"));
db.once("open", () => {
    console.log("Connected to Database :: MongoDB");
});

module.exports = db;
