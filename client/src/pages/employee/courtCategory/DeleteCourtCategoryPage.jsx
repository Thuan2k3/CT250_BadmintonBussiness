import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import { message } from "antd";
import Layout from "../../../components/Layout";

const DeleteCourtCategoryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const handleDeleteCourtCategory = async () => {
        dispatch(showLoading()); // Hiển thị loading trước khi gọi API
        try {
            const res = await axios.delete(
                `http://localhost:8080/api/v1/employee/court-categories/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            dispatch(hideLoading()); // Ẩn loading sau khi API trả về
            message.success("Xoá danh mục sân thành công");
            // Delay nhẹ để tránh lỗi UI khi chuyển trang quá nhanh
            setTimeout(() => navigate("/employee/court-category"), 500);
        } catch (error) {
            dispatch(hideLoading()); // Đảm bảo luôn ẩn loading nếu API lỗi
            console.error("Lỗi khi xoá danh mục sân:", error);
            // Hiển thị lỗi chi tiết nếu có phản hồi từ server
            const errorMessage =
                error.response?.data?.message || "Lỗi khi xoá danh mục sân!";
            message.error(errorMessage);
        }
    };
    const handleCancel = () => {
        navigate("/employee/court-category");
    };
    return (
        <Layout>
            <div>
                <h1 className="text-center">Xoá danh mục sân</h1>
                <div className="m-2 border border-secondary bg-light rounded">
                    <h3 className="text-center">
                        {" "}
                        Bạn có chắc chắn muốn xóa danh mục sân này không?
                    </h3>
                    <div className="d-flex justify-content-center">
                        <button
                            className="m-1 btn btn-danger"
                            onClick={handleDeleteCourtCategory}
                        >
                            Đồng ý
                        </button>
                        <button className="m-1 btn btn-secondary" onClick={handleCancel}>
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DeleteCourtCategoryPage;
