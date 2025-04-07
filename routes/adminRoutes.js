const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllAccountController,
  getAccountController,
  createAccountController,
  updateAccountController,
  deleteAccountController,
  getAllTimeSlotController,
  getTimeSlotController,
  createTimeSlotController,
  updateTimeSlotController,
  deleteTimeSlotController,
  getRevenueController,
  getAllCustomerController,
  getCustomerController,
  updateReputationController,
} = require("../controllers/adminCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// Lấy danh sách khung gio
router.get("/time-slot", authMiddleware, getAllTimeSlotController);

// Lấy mot khung gio
router.get("/time-slot/:id", authMiddleware, getTimeSlotController);

//Them khung gio
router.post("/time-slot", authMiddleware, createTimeSlotController);

//cap nhat khung gio
router.put("/time-slot/:id", authMiddleware, updateTimeSlotController);

//Xoa khung gio
router.delete("/time-slot/:id", authMiddleware, deleteTimeSlotController);

// Lấy danh sách tai khoan
router.get("/account", authMiddleware, getAllAccountController);

// Lấy mot tai khoan
router.get("/account/:id", authMiddleware, getAccountController);

//Them tai khoan
router.post("/account", authMiddleware, createAccountController);

//cap nhat tai khoan
router.put("/account/:id", authMiddleware, updateAccountController);

//Xoa tai khoan
router.delete("/account/:id", authMiddleware, deleteAccountController);
// Lấy danh sách khách hàng
router.get("/customer", authMiddleware, getAllCustomerController);

// Lấy mot khách hàng
router.get("/customer/:id", authMiddleware, getCustomerController);

// Cập nhật điểm uy tin khách hàng
router.put("/reputation/:id", authMiddleware, updateReputationController);

// API: Thống kê tổng doanh thu theo ngày, tháng, năm
router.get("/revenue", authMiddleware, getRevenueController);

module.exports = router;
