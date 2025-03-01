import { Button, message } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { ref, remove } from "firebase/database";
import { database } from "../firebaseConfig";
import axios from "axios"; // Import axios
import { useSelector } from "react-redux";
import moment from "moment";

const CheckoutButton = ({
  getTotalAmountForCourt,
  selectedCourt,
  selectedUser,
  orderItemsCourt,
  setOrderItemsCourt,
  invoiceTime,
  setInvoiceTime,
  defaultCourt,
  setSelectedCourt,
}) => {
  const { user } = useSelector((state) => state.user);
  const handleCheckoutBill = async () => {
    const newTotal = getTotalAmountForCourt(selectedCourt._id);

    if (!orderItemsCourt || newTotal <= 0) {
      message.warning("Không có hóa đơn nào để thanh toán!");
      return;
    }

    if (selectedCourt && !selectedCourt.isEmpty) {
      message.warning(
        `Sân ${selectedCourt.name} vẫn đang được sử dụng! Vui lòng check-out trước khi thanh toán.`
      );
      return;
    }

    // ✅ Lọc danh sách order chỉ lấy dữ liệu của sân được chọn
    const selectedCourtOrders = orderItemsCourt.find(
      (item) => String(item.court?._id) === String(selectedCourt?._id)
    );

    if (!selectedCourtOrders) {
      message.warning("Không có sản phẩm nào để thanh toán!");
      return;
    }

    // ✅ Duyệt qua danh sách `products` của sân được chọn
    const invoiceDetails = selectedCourtOrders.products.map((product) => ({
      product: product._id,
      priceAtTime: product.price,
      quantity: product.quantity || 1,
    }));

    // Lọc danh sách order chỉ lấy dữ liệu của sân được chọn
    const filteredOrderItems = orderItemsCourt.filter(
      (item) => item.court?._id === selectedCourt?._id
    );

    // Lấy thông tin check-in và check-out từ CourtInvoice
    const courtInvoice = filteredOrderItems.find(
      (item) => item.courtInvoice // Giả sử mỗi item có chứa thông tin invoice
    );

    const checkInTime =
      courtInvoice?.courtInvoice?.checkInTime || new Date().toISOString();
    const checkOutTime =
      courtInvoice?.courtInvoice?.checkOutTime || new Date().toISOString();

    const parseDateString = (dateString) => {
      return moment(dateString, "HH:mm:ss D/M/YYYY").toISOString();
    };

    const invoiceData = {
      staff: user._id,
      customer: selectedUser?._id || null,
      court: selectedCourt?._id === "guest" ? null : selectedCourt?._id,
      totalAmount: newTotal,
      checkInTime: parseDateString(checkInTime),
      checkOutTime: parseDateString(checkOutTime),
      invoiceDetails,
    };

    console.log(invoiceData);

    console.log("📜 Hóa đơn gửi lên:", invoiceData); // Debug dữ liệu gửi API

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/admin/invoice",
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      message.success(
        `Hóa đơn đã lưu! Tổng tiền: ${newTotal.toLocaleString()} VND`
      );

      // ✅ Xóa dữ liệu của sân đã thanh toán
      let updatedOrderItemsCourt = orderItemsCourt.filter(
        (item) => item.court?._id !== selectedCourt?._id
      );

      let updatedInvoiceTime = invoiceTime.filter(
        (item) => String(item.courtId) !== String(selectedCourt?._id)
      );

      setOrderItemsCourt(updatedOrderItemsCourt);
      setInvoiceTime(updatedInvoiceTime);
      setSelectedCourt(defaultCourt);

      const courtId = selectedCourt?._id || "guest";

      if (courtId === "guest") {
        localStorage.removeItem("guest_order");
      } else {
        const orderRef = ref(database, `orders/${courtId}`);
        await remove(orderRef);
      }
    } catch (error) {
      console.error("Lỗi khi lưu hóa đơn:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi thanh toán! Vui lòng thử lại."
      );
    }
  };

  return (
    <Button
      type="primary"
      icon={<DollarCircleOutlined />}
      onClick={handleCheckoutBill}
    >
      Thanh toán
    </Button>
  );
};

export default CheckoutButton;
