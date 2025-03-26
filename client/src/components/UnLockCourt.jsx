import { useState } from 'react';
import { Button, DatePicker, Space, Input, Select, Modal, message, Table, Tag, Popconfirm } from 'antd';
import { UnlockOutlined } from "@ant-design/icons";
import axios from 'axios';
import dayjs from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const UnLockCourt = (props) => {
    const { courts, getAllCourts } = props;
    const [updatedLockDates, setUpdatedLockDates] = useState([]);
    const [currentLockReason, setCurrentLockReason] = useState("");
    const [updatedLockReason, setUpdatedLockReason] = useState("");
    const [isModalUnLockOpen, setIsModalUnLockOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState(null);

    const openEditModal = (court) => {
        setSelectedCourt(court);
        setCurrentLockReason(court.lockReason);
        setUpdatedLockReason(court.lockReason || "");
        setIsModalEditOpen(true);
    };

    const handleUnLockCourt = async (courtId) => {
        console.log(">>>>>>>>>>>>>>>>>>>: ", courtId)
        try {
            const res = await axios.post(
                "http://localhost:8080/api/v1/employee/court/unlock",
                {
                    courtId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                message.success("Mở khóa sân thành công!");
                getAllCourts();
            } else {
                message.error("Mở khóa sân thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi mở khóa sân.");
        }
    };

    const handleUpdateLockDates = async (courtId) => {
        if (!updatedLockDates && !updatedLockReason) {
            message.warning("Không có sự thay đổi!");
            return;
        }

        const start = dayjs(updatedLockDates[0]).startOf("day");
        const end = dayjs(updatedLockDates[1]).startOf("day");

        let allDates = [];
        let current = start;
        while (current.isBefore(end) || current.isSame(end, "day")) {
            allDates.push(current.format("YYYY-MM-DD"));
            current = current.add(1, "day"); // Tăng thêm 1 ngày
        }

        console.log(">>>>>>>>>>>>>>>>>>>: ", courtId)
        console.log(">>>>>>>>>>>>>>>>>>>: ", allDates)
        console.log(">>>>>>>>>>>>>>>>>>>: ", updatedLockReason)

        try {
            const res = await axios.post(
                "http://localhost:8080/api/v1/employee/court/update-lock",
                {
                    courtId,
                    updatedLockDates: allDates,
                    updatedLockReason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                message.success("Cập nhật thành công!");
                setIsModalEditOpen(false);
                getAllCourts();
            } else {
                message.error("Cập nhật sân thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi cập nhật sân.");
        }
    }

    const columns = [
        {
            title: 'Tên sân',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === "Bị khóa" ? "red" : "green"}>{status}</Tag>
            ),
        },
        {
            title: 'Ngày khóa sân',
            dataIndex: 'lockedDates',
            key: 'lockedDates',
        },
        {
            title: 'Lý do khóa',
            key: 'lockReason',
            render: (_, record) => (
                record.hasLockedDates ? (
                    `${record.lockReason}`
                ) : ""
            )
        },
        {
            title: 'Tùy chọn',
            key: 'action',
            render: (_, record) => (
                record.hasLockedDates ? (
                    <Space size="small">
                        <Popconfirm
                            title="Mở khóa sân"
                            description="Bạn có chắc mở khóa sân này?"
                            onConfirm={() => handleUnLockCourt(record.key)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger> Mở khóa </Button>
                        </Popconfirm>
                        <Button
                            onClick={() => openEditModal(record)}
                        >
                            Điều chỉnh
                        </Button>
                        {/* a============================== */}
                    </Space >
                ) : null
            ),
        },
    ];

    const data = courts.map((court) => {
        const hasLockedDates = court.lockedDates && court.lockedDates.length > 0;
        const lockedDatesText = hasLockedDates ? (
            <>
                Từ <strong>{dayjs(court.lockedDates[0].date).format("DD/MM/YYYY")}</strong> đến <strong>{dayjs(court.lockedDates[court.lockedDates.length - 1].date).format("DD/MM/YYYY")}</strong>
            </>
        ) : "Không có";

        return {
            key: court._id,
            name: court.name,
            status: hasLockedDates ? "Bị khóa" : "Hoạt động",
            listOflockedDates: hasLockedDates ? court.lockedDates.map(d => d.date) : [],
            lockReason: hasLockedDates ? court.lockedDates[0].reason : "Không có lý do",
            lockedDates: lockedDatesText,
            hasLockedDates, // Thêm thuộc tính để kiểm tra khi render button
        };
    });

    return (
        <>

            <Button type="primary" onClick={() => setIsModalUnLockOpen(true)}>
                Mở khóa sân
            </Button>


            <Modal
                title="Mở khóa sân"
                open={isModalUnLockOpen}
                onCancel={() => setIsModalUnLockOpen(false)}
                footer={null}
                width={1000}
            >
                <Table columns={columns} dataSource={data} />
            </Modal>

            <Modal
                title="Chỉnh sửa khóa sân"
                open={isModalEditOpen}
                onCancel={() => setIsModalEditOpen(false)}
                onOk={() => handleUpdateLockDates(selectedCourt.key)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    <RangePicker
                        value={selectedCourt ? [dayjs(selectedCourt.listOflockedDates[0]), dayjs(selectedCourt.listOflockedDates[selectedCourt.listOflockedDates.length - 1])] : []}
                        onChange={(dates) => setUpdatedLockDates(dates)}
                        style={{ width: '100%' }}
                    />
                    <TextArea
                        rows={3}
                        placeholder="Nhập lý do chỉnh sửa"
                        value={updatedLockReason}  // Đảm bảo giá trị được cập nhật
                        onChange={(e) => setUpdatedLockReason(e.target.value)} // Cập nhật state khi nhập
                    />
                </Space>
            </Modal>
        </>
    );
}

export default UnLockCourt;