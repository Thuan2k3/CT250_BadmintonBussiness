const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, // Giữ ID cố định cho bảng con
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee", "customer"],
      required: false,
      default: "customer",
    },
    status: {
      type: Boolean,
      enum: ["pending", "blocked", "active"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
