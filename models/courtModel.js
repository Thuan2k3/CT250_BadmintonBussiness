const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String, // Lưu URL ảnh sân
  },
  isEmpty: {
    type: Boolean,
    default: true, // Mặc định sân đang trống
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courtcategories", // Liên kết đến CourtCategory
    required: false,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
    },
  ],
  lockedDates: [
    {
      date: { type: Date, required: true },
      reason: { type: String, default: "" },
    },
  ],
});

const Court = mongoose.model("courts", courtSchema);

module.exports = Court;
