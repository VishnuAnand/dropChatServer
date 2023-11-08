const mongoose = require("mongoose");


const fileSchema = new mongoose.Schema({
    name: String,
    recievers: Array,
    hash: {
        type: String,
        unique: true, 
    },
    path: String,
    time : { type : Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);