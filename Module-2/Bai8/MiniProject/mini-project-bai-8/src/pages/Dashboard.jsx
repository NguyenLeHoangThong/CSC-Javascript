import { useEffect, useMemo, useCallback, useContext, useReducer } from "react";
import {
  Container,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { productService } from "../services/productService";
import ProductRow from "../components/ProductRow";
import { dashboardReducer, initialState } from "../store/productReducer"; // Import reducer

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  // 1. Thay thế useState bằng useReducer
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { products, search, loading, error } = state;

  // 2. Cập nhật useEffect gọi API
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const data = await productService.getProducts(20);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: "Không thể tải danh sách sản phẩm!" });
      }
    };
    fetchProducts();
  }, []);

  // 3. Tối ưu lọc danh sách (Dùng state.search và state.products)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  }, [search, products]);

  // 4. Hàm xóa với dispatch
  const handleDelete = useCallback((id) => {
    dispatch({ type: "DELETE_PRODUCT", payload: id });
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Xin chào, {user?.name}
        </Typography>
        <Button variant="contained" onClick={logout} color="error">
          Đăng xuất
        </Button>
      </Box>

      {/* Dispatch action khi nhập liệu search */}
      <TextField
        fullWidth
        label="Tìm kiếm sản phẩm nhanh..."
        variant="outlined"
        value={search}
        onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
        sx={{ mb: 4 }}
      />

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
