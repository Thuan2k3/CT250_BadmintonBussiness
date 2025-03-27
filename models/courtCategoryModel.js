const mongoose = require("mongoose");

const courtCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
});

const courtCategory = mongoose.model("courtcategories", courtCategorySchema);

module.exports = courtCategory;
