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
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
    },
  ],
  lockedDates: {
    type: [
      {
        date: Date,
        reason: String,
      },
    ],
    default: [],
  },
});

const Court = mongoose.model("courts", courtSchema);

module.exports = Court;
