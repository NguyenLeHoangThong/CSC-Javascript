import React from "react";
import { FormBuilder } from "./components/FormBuilder";
import { Container, Divider } from "@mui/material";

// 1. Định nghĩa các Interfaces khác nhau
interface UserProfile {
  username: string;
  email: string;
  age: number;
}

interface ProductInfo {
  productName: string;
  price: number;
  stock: number;
}

const App: React.FC = () => {
  return (
    <Container>
      {/* 2. Sử dụng FormBuilder cho User */}
      <FormBuilder<UserProfile>
        title="Đăng ký tài khoản"
        initialValues={{ username: "", email: "", age: 18 }}
        fields={[
          { name: "username", label: "Tên đăng nhập", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "age", label: "Tuổi", type: "number" },
        ]}
        onSubmit={(data) => console.log("User Data:", data)}
      />

      <Divider sx={{ my: 6 }} />

      {/* 3. Sử dụng FormBuilder cho Product - Reusable! */}
      <FormBuilder<ProductInfo>
        title="Thêm sản phẩm mới"
        initialValues={{ productName: "", price: 0, stock: 0 }}
        fields={[
          { name: "productName", label: "Tên sản phẩm", required: true },
          { name: "price", label: "Giá bán", type: "number", required: true },
          { name: "stock", label: "Số lượng kho", type: "number" },
        ]}
        onSubmit={(data) => console.log("Product Data:", data)}
      />
    </Container>
  );
};

export default App;
