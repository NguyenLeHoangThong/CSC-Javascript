import { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { Container, Table, TableBody, TableHead, TableRow, TableCell, TextField, Typography, Box, Button, CircularProgress } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { productService } from "../services/productService"; // Import service mới
import ProductRow from "../components/ProductRow";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Gọi API thông qua Service lớp trung gian
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts(20);
        setProducts(data);
      } catch (err) {
        // Xử lý lỗi tại đây (ví dụ: show thông báo)
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Tối ưu lọc danh sách với useMemo
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  }, [search, products]);

  // Tối ưu hàm xóa với useCallback để tránh re-render ProductRow
  const handleDelete = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      {/* Header section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Xin chào, {user?.name}
        </Typography>
        <Button variant="contained" onClick={logout} color="inherit">
          Đăng xuất
        </Button>
      </Box>

      {/* Search section */}
      <TextField fullWidth label="Tìm kiếm sản phẩm nhanh..." variant="outlined" onChange={(e) => setSearch(e.target.value)} sx={{ mb: 4 }} />

      {/* Main Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((p) => (
              <ProductRow key={p.id} product={p} onDelete={handleDelete} />
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
