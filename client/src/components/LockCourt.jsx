import { useState } from 'react';
import { Button, DatePicker, Space, Input, Select, Modal, message } from 'antd';
import axios from 'axios';
import dayjs from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const LockCourt = (props) => {
    const { courts, getAllCourts } = props;
    const [selectedCourts, setSelectedCourts] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [lockReason, setLockReason] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const options = court.map((court) => ({
    //     label: court.name,
    //     value: court._id,
    // }));
    const options = courts
        .filter((court) => !court.lockedDates || court.lockedDates.length === 0) // Chỉ lấy sân chưa khóa
        .map((court) => ({
            label: court.name,
            value: court._id,
        }));

    const handleCourtChange = (value) => {
        setSelectedCourts(value);
    };

    const resetData = () => {
        setSelectedCourts([]);
        setSelectedDates([]);
        setLockReason("");
        setIsModalOpen(false); // Đóng modal sau khi thành công
    }

    const handleLockCourt = async () => {
        if (!selectedCourts.length || !selectedDates.length || !lockReason) {
            message.warning("Vui lòng chọn sân, thời gian và nhập lý do.");
            return;
        }

        // Chuyển đổi ngày thành dạng dayjs
        const today = dayjs().startOf("day"); // Ngày hôm nay (00:00)
        const start = dayjs(selectedDates[0]).startOf("day");
        const end = dayjs(selectedDates[1]).startOf("day");

        // Kiểm tra nếu ngày bắt đầu nhỏ hơn hôm nay
        if (start.isBefore(today)) {
            message.error("Không thể chọn ngày trong quá khứ!");
            return;
        }


        let allDates = [];
        let current = start;
        while (current.isBefore(end) || current.isSame(end, "day")) {
            allDates.push(current.format("YYYY-MM-DD"));
            current = current.add(1, "day"); // Tăng thêm 1 ngày
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/api/v1/employee/court/lock",
                {
                    courtIds: selectedCourts,
                    lockedDates: allDates,
                    lockReason: lockReason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                message.success("Khóa sân thành công!");
                resetData();
                getAllCourts();
            } else {
                message.error("Khóa sân thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi khóa sân.");
        }
    };

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Khóa sân
            </Button>

            <Modal
                title="Khóa sân"
                open={isModalOpen}
                onOk={handleLockCourt}
                onCancel={() => setIsModalOpen(false)}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Vui lòng chọn sân"
                        value={selectedCourts}
                        onChange={handleCourtChange}
                        options={options}
                    />
                    <RangePicker
                        value={selectedDates}
                        onChange={(dates) => setSelectedDates(dates)}
                        style={{ width: '100%' }}
                    />
                    <TextArea
                        rows={3}
                        placeholder="Nhập lý do khóa sân"
                        value={lockReason}
                        onChange={(e) => setLockReason(e.target.value)}
                    />
                </Space>
            </Modal>
        </>
    );
};

export default LockCourt;
