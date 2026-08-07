import {
  Alert, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { Link as RouterLink } from "react-router-dom";

import BackButton from "../components/common/BackButton";
import EmptyState from "../components/common/EmptyState";

import { createOrder } from "../services/orderService";
import { getProvinces, getWardsByProvince } from "../services/locationService";

import { useCart } from "../context/CartProvider";
import { checkoutSchema, CheckoutFormData } from "../schemas/checkoutSchema";
import type { Province, Ward } from "../types/checkout";
import { CreateOrderPayload } from "../types/order";

const CheckoutPage = () => {
  const {
    register, control, handleSubmit, formState: { errors }, reset, resetField,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: { name: "", email: "", phone: "", address: "", provinceCode: "", wardCode: "", deliveryDate: "", note: "" },
  });

  const { cartItems, totalPrice, dispatch } = useCart();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const provinceCode = useWatch({ control, name: "provinceCode" });
  const wardCode = useWatch({ control, name: "wardCode" });

  useEffect(() => {
    getProvinces().then(setProvinces).catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!provinceCode) { setWards([]); return; }
      try {
        setLoadingWards(true);
        setWards((await getWardsByProvince(provinceCode)) || []);
      } catch {
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };
    run();
  }, [provinceCode]);

  useEffect(() => { resetField("wardCode"); }, [provinceCode, resetField]);

  const selectedProvince = provinces.find((p) => String(p.code) === String(provinceCode));
  const selectedWard = wards.find((w) => String(w.code) === String(wardCode));

  const onSubmit = async (formData: CheckoutFormData) => {
    if (cartItems.length === 0) { setSubmitError("Giỏ hàng trống."); return; }
    try {
      setSubmitting(true);
      setSubmitError("");

      // Bài 31 — tên field phải khớp `orderCreateSchema` của backend:
      // customerName/email/phone (không phải userName/userEmail/userPhone), và mỗi item
      // chỉ gồm productId + quantity. Backend tự tra giá từ DB nên gửi kèm `price`
      // vừa thừa vừa nguy hiểm (client sửa giá được).
      const payload: CreateOrderPayload = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        provinceCode: formData.provinceCode,
        wardCode: formData.wardCode,
        deliveryDate: formData.deliveryDate,
        note: formData.note,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(payload);
      setSuccess(true);
      dispatch({ type: "CLEAR_CART" });
      reset();
    } catch (err: any) {
      // Backend returns 409 with a clear message when a product is out of stock
      setSubmitError(err?.response?.data?.message ?? "Không đặt được hàng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Đặt hàng xong -> giỏ bị dọn -> `cartItems.length === 0`. Nhánh success PHẢI được
  // kiểm tra TRƯỚC nhánh giỏ trống, nếu không người mua vừa đặt hàng thành công lại
  // thấy đúng dòng "Chưa có sản phẩm trong giỏ", còn Snackbar chúc mừng thì bị unmount
  // ngay lập tức nên không ai kịp nhìn. (Lỗi này do E2E phát hiện.)
  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Đặt hàng thành công!</Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Cảm ơn bạn đã mua hàng tại CSC Shop. Chúng tôi sẽ liên hệ để xác nhận đơn.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "center" }}>
            <Button variant="contained" component={RouterLink} to="/">Tiếp tục mua sắm</Button>
            <Button variant="outlined" component={RouterLink} to="/my-orders">Xem đơn hàng của tôi</Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return <EmptyState message="Chưa có sản phẩm trong giỏ. Thêm sản phẩm trước khi thanh toán." showBackHome />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Box sx={{ mb: 2.5 }}><BackButton /></Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Thanh toán</Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Họ tên" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Số điện thoại" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name="provinceCode"
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.provinceCode}>
                        <InputLabel id="province-label">Tỉnh/Thành</InputLabel>
                        <Select labelId="province-label" label="Tỉnh/Thành" {...field}>
                          {provinces.map((p) => (
                            <MenuItem key={p.code} value={String(p.code)}>{p.name}</MenuItem>
                          ))}
                        </Select>
                        <Typography variant="caption" color="error">{errors.provinceCode?.message}</Typography>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name="wardCode"
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!provinceCode || loadingWards} error={!!errors.wardCode}>
                        <InputLabel id="ward-label">Phường/Xã</InputLabel>
                        <Select labelId="ward-label" label="Phường/Xã" {...field}>
                          {wards.map((w) => (
                            <MenuItem key={w.code} value={String(w.code)}>{w.name}</MenuItem>
                          ))}
                        </Select>
                        <Typography variant="caption" color="error">{errors.wardCode?.message}</Typography>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Địa chỉ" multiline rows={3} {...register("address")} error={!!errors.address} helperText={errors.address?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="deliveryDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Ngày giao"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date ? date.format("YYYY-MM-DD") : "")}
                        slotProps={{ textField: { fullWidth: true, error: !!errors.deliveryDate, helperText: errors.deliveryDate?.message } }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Ghi chú" {...register("note")} error={!!errors.note} helperText={errors.note?.message} />
                </Grid>
              </Grid>

              {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={submitting}>
                {submitting ? "Đang đặt hàng..." : "Đặt hàng"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
            <Typography variant="h6">Tóm tắt đơn hàng</Typography>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>{item.title} x{item.quantity}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{(Number(item.price) * item.quantity).toLocaleString()}₫</Typography>
                </Box>
              ))}
            </Stack>
            <Typography sx={{ mt: 2, fontWeight: 700 }}>Tổng: {Number(totalPrice).toLocaleString()}₫</Typography>
            {selectedProvince && <Typography color="text.secondary">Tỉnh: {selectedProvince.name}</Typography>}
            {selectedWard && <Typography color="text.secondary">Phường/Xã: {selectedWard.name}</Typography>}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
