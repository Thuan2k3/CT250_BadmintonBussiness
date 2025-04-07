const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllProductCategoryController,
  deleteProductCategoryController,
  updateProductCategoryController,
  getProductCategoryByIdController,
  createProductController,
  createProductCategoryController,
  getAllProductController,
  deleteProductController,
  getProductController,
  updateProductController,
  getAllCourtController,
  getCourtController,
  createCourtController,
  updateCourtController,
  deleteCourtController,
  getAccountController,
  getCourtsWithBookingsController,
  getAllInvoicesController,
  createInvoiceController,
  getInvoiceDetailController,
  getTimeSlotBooking,
  getAllCustomerController,
} = require("../controllers/employeeCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// Lấy danh sách san
router.get("/court", authMiddleware, getAllCourtController);

// Lấy mot san
router.get("/court/:id", authMiddleware, getCourtController);

//Them san
router.post("/court", authMiddleware, createCourtController);

//cap nhat san
router.put("/court/:id", authMiddleware, updateCourtController);

//Xoa san
router.delete("/court/:id", authMiddleware, deleteCourtController);

//Route lay bookings tu court
router.get("/bookings/court", authMiddleware, getCourtsWithBookingsController);

// Lấy danh sách danh mục
router.get(
  "/product-categories",
  authMiddleware,
  getAllProductCategoryController
);
// Lấy một danh mục
router.get(
  "/product-categories/:id",
  authMiddleware,
  getProductCategoryByIdController
);

// Thêm danh mục mới
router.post(
  "/product-categories",
  authMiddleware,
  createProductCategoryController
);

router.put(
  "/product-categories/:id",
  authMiddleware,
  updateProductCategoryController
);

// Xóa danh mục
router.delete(
  "/product-categories/:id",
  authMiddleware,
  deleteProductCategoryController
);

// Lấy danh sách san pham
router.get("/product", authMiddleware, getAllProductController);

// Lấy mot san pham
router.get("/product/:id", authMiddleware, getProductController);

//Them san pham
router.post("/product", authMiddleware, createProductController);

//cap nhat san pham
router.put("/product/:id", authMiddleware, updateProductController);

//Xoa san pham
router.delete("/product/:id", authMiddleware, deleteProductController);

// Lấy danh sách khach hang
router.get("/customer", authMiddleware, getAllCustomerController);

// Lấy mot tai khoan
router.get("/account/:id", authMiddleware, getAccountController);

// Lấy danh sách hóa đơn
router.get("/invoice", authMiddleware, getAllInvoicesController);

// Tạo hóa đơn
router.post("/invoice", authMiddleware, createInvoiceController);

//Lấy hóa đơn theo id
router.get("/invoice/:id", authMiddleware, getInvoiceDetailController);

router.get("/court/:courtId/:date/:time", authMiddleware, getTimeSlotBooking);

module.exports = router;
