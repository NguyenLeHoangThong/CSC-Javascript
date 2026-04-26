import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Avatar,
  IconButton,
  Alert,
  Skeleton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useForm } from "react-hook-form";
import { UserService } from "../services/userService";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // State quản lý Popup xác nhận xóa
  const [deleteId, setDeleteId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAll();
        setUsers(data);
      } catch (err) {
        showToast("Không thể tải danh sách!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const onAddUser = async (data) => {
    try {
      const newUser = await UserService.create(data);
      setUsers([{ ...newUser, id: Date.now() }, ...users]);
      showToast("Thêm người dùng thành công!");
      reset();
    } catch (err) {
      showToast("Lỗi khi thêm!", "error");
    }
  };

  // Mở Popup và lưu lại ID cần xóa
  const handleOpenConfirm = (id) => {
    setDeleteId(id);
  };

  // Đóng Popup
  const handleCloseConfirm = () => {
    setDeleteId(null);
  };

  // Thực thi xóa thật sau khi xác nhận
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await UserService.delete(deleteId);
      setUsers(users.filter((u) => u.id !== deleteId));
      showToast("Đã xóa người dùng.");
    } catch (err) {
      showToast("Xóa thất bại!", "error");
    } finally {
      handleCloseConfirm();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        USER MANAGEMENT
      </Typography>

      {/* FORM THÊM MỚI (Giữ nguyên như cũ) */}
      <Paper sx={{ p: 3, mb: 5, borderRadius: 3 }}>
        <form onSubmit={handleSubmit(onAddUser)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField fullWidth label="Họ và tên" {...register("name", { required: "Bắt buộc" })} error={!!errors.name} />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField fullWidth label="Email" {...register("email", { required: "Bắt buộc" })} error={!!errors.email} />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button fullWidth variant="contained" type="submit" startIcon={<PersonAddIcon />} disabled={isSubmitting} sx={{ height: 56 }}>
                Thêm
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* DANH SÁCH NGƯỜI DÙNG */}
      <Stack spacing={2}>
        {loading ? (
          <Skeleton variant="rectangular" height={200} />
        ) : (
          users.map((user) => (
            <Paper key={user.id} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }} variant="outlined">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main" }}>{user.name[0]}</Avatar>
                <Box>
                  <Typography fontWeight="bold">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
              {/* Bấm vào đây chỉ mở Popup chứ chưa xóa ngay */}
              <IconButton color="error" onClick={() => handleOpenConfirm(user.id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        )}
      </Stack>

      {/* POPUP XÁC NHẬN XÓA (DIALOG) */}
      <Dialog open={Boolean(deleteId)} onClose={handleCloseConfirm}>
        <DialogTitle>Xác nhận xóa?</DialogTitle>
        <DialogContent>
          <DialogContentText>Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa người dùng này khỏi hệ thống?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseConfirm} color="inherit">
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* TOAST THÔNG BÁO */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
