import React, { useEffect, useState } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { FloatButton, Button } from 'antd';
import Layout from '../../components/Layout';
import "../customer/product.css";
import axios from 'axios';


const ShowProductPage = () => {
    const [products, setProducts] = useState();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/v1/user/product");
                console.log("Check API Response: ", response.data);
                if (response.data.success) {
                    setProducts(response.data.products); // Cập nhật state
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []); // Chạy 1 lần khi component mount

    return (
        <>
            <Layout>
                <h1 className="text-center">Sản phẩm</h1>

                <FloatButton
                    shape="circle"
                    icon={<ShoppingCartOutlined />}
                    style={{
                        insetInlineEnd: 150,
                        bottom: 600,
                    }}
                    badge={{
                        count: 0,
                    }}
                />
                <section className="product">
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <div className="card" key={product.id}>
                                <div className="contant">
                                    <div className="card-img">
                                        <img src={`http://localhost:8080${product.image}`} alt={product.title} className="" />
                                    </div>
                                    <div className="detail">
                                        <div className="info">
                                            <h5 className="title">{product.name}</h5>
                                            <p className="price">{product.price}</p>
                                        </div>

                                    </div>
                                    <Button
                                        type="primary"
                                        onClick={() => detailPage(product)}>
                                        View Product
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </section>
            </Layout>
        </>
    )
}

export default ShowProductPage;