import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import Layout from "../../../components/Layout";
import { Option } from "antd/es/mentions";
const { RangePicker } = DatePicker;

const CourtBookingHistoryPage = () => {
    const [dates, setDates] = useState([dayjs().startOf("month"), dayjs()]);
    const [type, setType] = useState("day");
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourtBookingHistory();
    }, []);

    const fetchCourtBookingHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const params = {};

            if (dates.length === 2) {
                params.startDate = dates[0].format("YYYY-MM-DD");
                params.endDate = dates[1].format("YYYY-MM-DD");
            }

            const res = await axios.get("http://localhost:8080/api/v1/admin/history", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(">>> Dữ liệu nhận được từ API:", res.data);
            setHistoryData(res.data);
        } catch (error) {
            if (error.response) {
                console.error("Lỗi từ API:", error.response.data);
                console.error("Mã lỗi:", error.response.status);
            } else if (error.request) {
                console.error("Không nhận được phản hồi từ server:", error.request);
            } else {
                console.error("Lỗi khi gửi request:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Booking ID",
            dataIndex: "_id",
            key: "_id",
        },
        {
            title: "Tên người đặt",
            dataIndex: "user",
            key: "user",
            render: (user) => user?.full_name || "N/A",
        },
        {
            title: "email người đặt",
            dataIndex: "user",
            key: "user",
            render: (user) => user?.email || "N/A",
        },
        {
            title: "Ngày đặt",
            dataIndex: "date",
            key: "date",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Loại sân",
            dataIndex: "court",
            key: "court",
            render: (court) => court?.name || "N/A",
        },
        {
            title: "Khung giờ",
            dataIndex: "timeSlot",
            key: "timeSlot",
            render: (timeSlot) => timeSlot?.time || "N/A",
        },
    ]
    return (
        <Layout>
            <h1 className="text-center">Lịch sử đặt sân</h1>
            <div className="mb-3 d-flex justify-content-center align-items-center gap-3">
                <RangePicker
                    value={dates}
                    onChange={(newDates) => {
                        if (newDates) {
                            let [start, end] = newDates;

                            if (type === "month") {
                                start = start.startOf("month");
                                end = end.endOf("month");
                            } else if (type === "year") {
                                start = start.startOf("year");
                                end = end.endOf("year");
                            }

                            setDates([start, end]);
                        } else {
                            setDates([dayjs(), dayjs()]);
                        }
                    }}
                    picker={type}
                    format={
                        type === "day"
                            ? "DD/MM/YYYY"
                            : type === "month"
                                ? "MM/YYYY"
                                : "YYYY"
                    }
                />
                <Select
                    value={type}
                    onChange={(newType) => {
                        setType(newType);

                        let newStart, newEnd;
                        if (newType === "day") {
                            newStart = dayjs().startOf("month");
                            newEnd = dayjs();
                        } else if (newType === "month") {
                            newStart = dayjs().startOf("year");
                            newEnd = dayjs().endOf("year");
                        } else if (newType === "year") {
                            newStart = dayjs().subtract(4, "year").startOf("year"); // Lấy 5 năm gần nhất
                            newEnd = dayjs().endOf("year");
                        }

                        setDates([newStart, newEnd]);
                    }}
                    style={{ width: 120 }}
                >
                    <Option value="day">Theo Ngày</Option>
                    <Option value="month">Theo Tháng</Option>
                    <Option value="year">Theo Năm</Option>
                </Select>
                <Button type="primary" onClick={fetchCourtBookingHistory}>
                    Lọc
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={historyData}
                pagination={{ pageSize: 10 }}
                loading={loading}
                rowKey="_id"
            />
        </Layout>
    );
}

export default CourtBookingHistoryPage;