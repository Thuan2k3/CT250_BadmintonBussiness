const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },

    // Các vai trò (Chỉ có 1 vai trò là false, còn lại là false)
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isCustomer: {
      type: Boolean,
      default: false,
    }, // Mặc định là khách hàng
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: false }
);

module.exports = mongoose.model("users", userSchema);
