// import React, { useEffect, useState } from "react";
// import Layout from "../../../components/Layout";
// import { Form, Input, message } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
// import axios from "axios";

// const UpdateCourtCategoryPage = () => {
//     const { id } = useParams();
//     const [form] = Form.useForm();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [name, setName] = useState("");

//     // Cập nhật danh mục sân
//     const handleUpdateCourtCategory = async () => {
//         try {
//             dispatch(showLoading());
//             const res = await axios.put(
//                 `http://localhost:8080/api/v1/admin/court-categories/${id}`,
//                 { name }, // Gửi dữ liệu từ state
//                 {
//                     headers: {
//                         Authorization: "Bearer " + localStorage.getItem("token"),
//                     },
//                 }
//             );
//             dispatch(hideLoading());
//             if (res.data.success) {
//                 message.success("Cập nhật danh mục thành công!");
//                 navigate("/admin/court-category");
//             } else {
//                 message.error(res.data.message);
//             }
//         } catch (error) {
//             dispatch(hideLoading());
//             message.error("Có lỗi xảy ra. Vui lòng thử lại!");
//         }
//     };

//     // Lấy thông tin danh mục sản phẩm theo ID
//     const getCourtCategoryById = async () => {
//         try {
//             const res = await axios.get(
//                 `http://localhost:8080/api/v1/admin/court-categories/${id}`,
//                 {
//                     headers: {
//                         Authorization: "Bearer " + localStorage.getItem("token"),
//                     },
//                 }
//             );
//             if (res.data.success) {
//                 setName(res.data.data.name); // Cập nhật state với tên danh mục
//             }
//         } catch (error) {
//             message.error("Có lỗi xảy ra. Vui lòng thử lại!");
//         }
//     };

//     useEffect(() => {
//         getCourtCategoryById();
//     }, []);

//     useEffect(() => {
//         if (name) {
//             form.setFieldsValue({
//                 name: name, // Đặt giá trị form
//             });
//         }
//     }, [name, form]); // Gọi lại khi name thay đổi

//     const handleNameChange = (e) => {
//         setName(e.target.value); // Cập nhật state khi người dùng thay đổi input
//     };

//     return (
//         <Layout>
//             <div className="p-4">
//                 <Form
//                     layout="vertical"
//                     onFinish={handleUpdateCourtCategory}
//                     form={form}
//                 >
//                     <h3 className="text-center">CẬP NHẬT DANH MỤC SÂN</h3>
//                     <Form.Item
//                         label="Tên danh mục"
//                         name="name"
//                         rules={[
//                             { required: true, message: "Vui lòng nhập tên loại sản phẩm" },
//                         ]}
//                     >
//                         <Input value={name} onChange={handleNameChange} />
//                     </Form.Item>
//                     <Form.Item
//                         label="Giá"
//                         name="price"
//                         rules={[
//                             { required: true, message: "Vui lòng nhập giá" },
//                         ]}
//                     >
//                         <Input value={price} onChange={handleNameChange} />
//                     </Form.Item>

//                     <button className="btn btn-primary">Cập nhật</button>
//                 </Form>
//             </div>
//         </Layout>
//     );
// };

// export default UpdateCourtCategoryPage;

import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import axios from "axios";

const UpdateCourtCategoryPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    // Cập nhật danh mục sân
    const handleUpdateCourtCategory = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.put(
                `http://localhost:8080/api/v1/admin/court-categories/${id}`,
                { name, price }, // Gửi dữ liệu từ state
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success("Cập nhật danh mục thành công!");
                navigate("/admin/court-category");
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            message.error("Có lỗi xảy ra. Vui lòng thử lại!");
        }
    };

    // Lấy thông tin danh mục sản phẩm theo ID
    const getCourtCategoryById = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/v1/admin/court-categories/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setName(res.data.data.name);
                setPrice(res.data.data.price);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra. Vui lòng thử lại!");
        }
    };

    useEffect(() => {
        getCourtCategoryById();
    }, []);

    useEffect(() => {
        if (name || price) {
            form.setFieldsValue({
                name: name,
                price: price,
            });
        }
    }, [name, price, form]);

    return (
        <Layout>
            <div className="p-4">
                <Form layout="vertical" onFinish={handleUpdateCourtCategory} form={form}>
                    <h3 className="text-center">CẬP NHẬT DANH MỤC SÂN</h3>
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên loại sản phẩm" }]}
                    >
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                    >
                        <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </Form.Item>
                    <button className="btn btn-primary">Cập nhật</button>
                </Form>
            </div>
        </Layout>
    );
};

export default UpdateCourtCategoryPage;