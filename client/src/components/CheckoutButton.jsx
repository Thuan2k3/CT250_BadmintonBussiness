import { Button, message, Modal } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { ref, remove } from "firebase/database";
import { database } from "../firebaseConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import moment from "moment";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

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
  type,
}) => {
  const { user } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

    if (type === "both") {
      const selectedCourtData = orderItemsCourt.find(
        (item) => item.court._id === selectedCourt._id
      );

      const hasProducts = selectedCourtData?.products.length > 0;

      if (!hasProducts) {
        message.warning(
          "Vui lòng chọn ít nhất một sản phẩm hoặc chọn loại thuê sân!"
        );
        return;
      }
    }
    if (type === "rent") {
      const selectedCourtData = orderItemsCourt.find(
        (item) => item.court._id === selectedCourt._id
      );

      const hasProducts = selectedCourtData?.products.length > 0;

      if (hasProducts) {
        if (selectedCourt._id === "guest") {
          message.warning(
            "Đang có sản phẩm. Vui lòng chọn loại hóa đơn Mua sản phẩm"
          );
        } else {
          message.warning(
            "Đang có sản phẩm. Vui lòng chọn loại hóa đơn Thuê sân và mua sản phẩm!"
          );
        }
        return;
      }
    }
    if (type === "both") {
      if (selectedCourt._id === "guest") {
        message.warning(
          "Đang có sản phẩm. Vui lòng chọn loại hóa đơn Mua sản phẩm!"
        );
        return;
      }
    }

    const selectedCourtOrders = orderItemsCourt.find(
      (item) => String(item.court?._id) === String(selectedCourt?._id)
    );

    if (!selectedCourtOrders) {
      message.warning("Không có sản phẩm nào để thanh toán!");
      return;
    }

    const invoiceDetails = selectedCourtOrders.products.map((product) => ({
      product: product._id,
      priceAtTime: product.price,
      quantity: product.quantity || 1,
    }));

    const filteredOrderItems = orderItemsCourt.filter(
      (item) => item.court?._id === selectedCourt?._id
    );

    const courtInvoice = filteredOrderItems.find((item) => item.courtInvoice);

    const checkInTime = courtInvoice?.courtInvoice?.checkInTime || null;
    const checkOutTime = courtInvoice?.courtInvoice?.checkOutTime || null;

    const parseDateString = (dateString) => {
      return moment(dateString, "HH:mm:ss D/M/YYYY").toISOString();
    };

    // ✅ Hàm làm tròn giờ
    const roundDownHour = (date) => {
      const d = new Date(date);
      return `${String(d.getHours()).padStart(2, "0")}:00`;
    };

    const roundUpHour = (date) => {
      const d = new Date(date);
      return d.getMinutes() > 0
        ? `${String(d.getHours() + 1).padStart(2, "0")}:00`
        : `${String(d.getHours()).padStart(2, "0")}:00`;
    };

    // Tính tổng số giờ theo TimeSlot (làm tròn theo giờ)
    const duration = (() => {
      // Làm tròn giờ check-in xuống, check-out lên
      const checkInHour = parseInt(
        roundDownHour(checkInTime).split(":")[0],
        10
      );
      const checkOutHour = parseInt(
        roundUpHour(checkOutTime).split(":")[0],
        10
      );

      const hours = checkOutHour - checkInHour;
      return Math.max(1, hours); // Tối thiểu 1 giờ
    })();

    const invoiceData = {
      employee: user._id,
      customer: selectedUser?._id || null,
      court: selectedCourt?._id === "guest" ? null : selectedCourt?._id,
      totalAmount: newTotal,
      checkInTime: parseDateString(checkInTime),
      checkOutTime: parseDateString(checkOutTime),
      duration,
      invoiceDetails,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/employee/invoice",
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate(
        `/employee/invoice/detail/${response.data.invoice._id}?autoPrint=true`
      );

      message.success(
        `Hóa đơn đã lưu! Tổng tiền: ${newTotal.toLocaleString()} VND`
      );

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
        console.log("✅ Đã xóa đơn hàng của khách vãng lai khỏi localStorage.");
      } else {
        try {
          const orderRef = ref(database, `orders/${courtId}`);
          await remove(orderRef);
          console.log(`✅ Đã xóa sân: ${courtId} khỏi Firebase.`);
        } catch (error) {
          console.error("❌ Lỗi khi xóa sân khỏi Firebase:", error);
          message.error("Lỗi khi cập nhật trạng thái sân! Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu hóa đơn:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi thanh toán! Vui lòng thử lại."
      );
    }
  };

  const showConfirmModal = () => {
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

    if (type === "both") {
      const selectedCourtData = orderItemsCourt.find(
        (item) => item.court._id === selectedCourt._id
      );

      const hasProducts = selectedCourtData?.products.length > 0;

      if (!hasProducts) {
        message.warning(
          "Vui lòng chọn ít nhất một sản phẩm hoặc chọn loại thuê sân!"
        );
        return;
      }
    }
    if (type === "rent") {
      const selectedCourtData = orderItemsCourt.find(
        (item) => item.court._id === selectedCourt._id
      );

      const hasProducts = selectedCourtData?.products.length > 0;

      if (hasProducts) {
        if (selectedCourt._id === "guest") {
          message.warning(
            "Đang có sản phẩm. Vui lòng chọn loại hóa đơn Mua sản phẩm"
          );
        } else {
          message.warning(
            "Đang có sản phẩm. Vui lòng chọn loại hóa đơn Thuê sân và mua sản phẩm!"
          );
        }
        return;
      }
    }
    if (type === "both") {
      if (selectedCourt._id === "guest") {
        message.warning(
          "Đang có sản phẩm. Vui lòng chọn loại hóa đơn Mua sản phẩm!"
        );
        return;
      }
    }

    const selectedCourtOrders = orderItemsCourt.find(
      (item) => String(item.court?._id) === String(selectedCourt?._id)
    );

    if (!selectedCourtOrders) {
      message.warning("Không có sản phẩm nào để thanh toán!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmCheckout = async () => {
    setIsModalOpen(false);
    await handleCheckoutBill();
  };

  return (
    <>
      <Button
        type="primary"
        icon={<DollarCircleOutlined />}
        onClick={showConfirmModal}
      >
        Thanh toán
      </Button>
      <Modal
        title="Xác nhận thanh toán"
        open={isModalOpen}
        onOk={handleConfirmCheckout}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn thanh toán không?</p>
      </Modal>
    </>
  );
};

export default CheckoutButton;
