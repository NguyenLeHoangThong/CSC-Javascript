import {
  Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import type { Product } from "../../types";

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const loadProducts = () => productApi.getAll({ limit: 100 }).then((res) => setProducts(res.data.data));

  useEffect(() => {
    loadProducts();
    categoryApi.getAll().then((res) => setCategories(res.data.data));
  }, []);

  const openCreate = () => { setEditing(null); setForm({}); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm(p); setDialogOpen(true); };

  const handleSave = async () => {
    if (editing) await productApi.update(editing.id, form);
    else await productApi.create(form);
    setDialogOpen(false);
    loadProducts();
  };

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    await productApi.remove(confirmDeleteId);
    setConfirmDeleteId(null);
    loadProducts();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Quản lý sản phẩm</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Thêm sản phẩm</Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ảnh</TableCell><TableCell>Tên</TableCell><TableCell>Danh mục</TableCell>
            <TableCell>Giá</TableCell><TableCell>Kho</TableCell><TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell><img src={p.thumbnail} width={48} alt={p.title} /></TableCell>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{Number(p.price).toLocaleString()}₫</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => openEdit(p)}><EditIcon /></IconButton>
                <IconButton onClick={() => setConfirmDeleteId(p.id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* One Dialog reused for both Create and Edit */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField label="Tên sản phẩm" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="Giá" type="number" value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <Select value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} displayEmpty>
            <MenuItem value="" disabled>Chọn danh mục</MenuItem>
            {categories.map((c) => <MenuItem key={c.slug} value={c.slug}>{c.name}</MenuItem>)}
          </Select>
          <TextField label="Kho" type="number" value={form.stock ?? ""} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          <TextField label="Thumbnail URL" value={form.thumbnail ?? ""} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
          <TextField label="Mô tả" multiline rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Xác nhận xóa sản phẩm?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProductsPage;
