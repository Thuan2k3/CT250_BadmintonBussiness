import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Form, Input, message, Button, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import UploadImage from "../../../components/UploadImage";

const UpdateCourtPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [courtCategories, setCourtCategories] = useState([]);
  const [selectedCourtCategory, setSelectedCategory] = useState(null);

  // Lấy danh sách loại sân
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/employee/court-categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        setCourtCategories(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại sân:", error);
    }
  };

  // Lấy thông tin sân
  const getCourt = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/employee/court/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setCourt(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sân:", error);
    }
  };

  // Set ảnh đã có sẵn
  const setImage = async () => {
    if (!court || !court.image) return;

    const url = court.image.startsWith("/")
      ? `http://localhost:8080${court.image}`
      : `http://localhost:8080/${court.image}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Không thể tải ảnh");

      const blob = await response.blob();
      const nameImage = court.image.replace("/uploads/", "");
      const file = new File([blob], nameImage, { type: blob.type });

      setSelectedFile(file);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    }
  };

  // Gán dữ liệu vào form khi đã có court và category
  useEffect(() => {
    if (court && Object.keys(court).length > 0 && courtCategories.length > 0) {
      form.setFieldsValue({
        name: court.name,
        category: court.category, // Nếu backend trả string _id
        description: court.description,
        image: court.image,
      });

      const foundCategory = courtCategories.find(
        (c) => c._id === court.category
      );
      setSelectedCategory(foundCategory);

      setImage();
    }
  }, [court, courtCategories]);

  useEffect(() => {
    getCourt();
    fetchCategories();
  }, []);

  // Xử lý thay đổi loại sân
  const handleCategoryChange = (value) => {
    const category = courtCategories.find((c) => c._id === value);
    setSelectedCategory(category);
    form.setFieldsValue({ category: value });
  };

  // Xử lý submit form
  const onFinishHandler = async (values) => {
    try {
      let imageUrl = court.image;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await axios.post("http://localhost:8080/api/v1/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!uploadRes.data.success) {
          message.error("Tải ảnh lên thất bại!");
          return;
        }

        imageUrl = uploadRes.data.url;
      }

      const updatedValues = { ...values, image: imageUrl };

      const res = await axios.put(
        `http://localhost:8080/api/v1/employee/court/${id}`,
        updatedValues,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        message.success("Cập nhật sân thành công!");
        navigate("/employee/court");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sân:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <Form form={form} layout="vertical" onFinish={onFinishHandler}>
          <h3 className="text-center">Cập nhật sân</h3>

          <Form.Item label="Tên sân" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sân" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Loại sân" name="category" rules={[{ required: true, message: "Vui lòng chọn loại sân" }]}>
            <Select placeholder="Chọn loại sân" onChange={handleCategoryChange}>
              {courtCategories.map((courtCategory) => (
                <Select.Option key={courtCategory._id} value={courtCategory._id}>
                  {courtCategory.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Giá mỗi giờ">
            <Input
              value={selectedCourtCategory?.price?.toLocaleString("vi-VN") + " ₫"}
              disabled
            />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Hình ảnh" name="image" rules={[{ required: true, message: "Vui lòng tải ảnh lên" }]}>
            <UploadImage
              onFileSelect={(file) => {
                setSelectedFile(file);
                form.setFieldsValue({ image: file.name });
              }}
              initImage={`http://localhost:8080${court.image}`}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Cập nhật sân
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default UpdateCourtPage;
