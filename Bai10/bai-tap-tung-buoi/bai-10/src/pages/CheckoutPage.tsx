import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";

import BackButton from "../components/common/BackButton";
import EmptyState from "../components/common/EmptyState";

import { createOrder } from "../services/orderService";
import { getProvinces, getWardsByProvince } from "../services/locationService";

import { useCart } from "../context/CartProvider";
import { checkoutSchema } from "../schemas/checkoutSchema";

import type { Province, Ward } from "../types/checkout";
import { CheckoutFormData } from "../schemas/checkoutSchema";
import { CreateOrderPayload } from "../types/order";

const CheckoutPage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }, // ✅ RESTORE ERRORS
    reset,
    resetField,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      provinceCode: "",
      wardCode: "",
      deliveryDate: "",
      note: "",
    },
  });

  const { cartItems, totalPrice, dispatch } = useCart();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState(false);

  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const provinceCode = useWatch({ control, name: "provinceCode" });
  const wardCode = useWatch({ control, name: "wardCode" });

  /* ================= LOAD PROVINCES ================= */
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingProvince(true);
        const data = await getProvinces();
        setProvinces(data);
      } finally {
        setLoadingProvince(false);
      }
    };

    fetch();
  }, []);

  /* ================= LOAD WARDS ================= */
  useEffect(() => {
    const fetch = async () => {
      if (!provinceCode) {
        setWards([]);
        return;
      }

      try {
        setLoadingWards(true);
        const data = await getWardsByProvince(provinceCode);
        setWards(data || []);
      } catch {
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };

    fetch();
  }, [provinceCode]);

  /* ================= RESET WARD WHEN PROVINCE CHANGED ================= */
  useEffect(() => {
    resetField("wardCode"); // ✅ chỉ reset field, KHÔNG clear wards
  }, [provinceCode, resetField]);

  const selectedProvince = provinces.find((p) => String(p.code) === String(provinceCode));

  const selectedWard = wards.find((w) => String(w.code) === String(wardCode));

  /* ================= SUBMIT ================= */
  const onSubmit = async (formData: CheckoutFormData) => {
    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const payload: CreateOrderPayload = {
        products: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        formData,
      };

      await createOrder(payload);

      setSuccess(true);
      dispatch({ type: "CLEAR_CART" });
      reset();
    } catch {
      setSubmitError("Cannot place order now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= EMPTY CART ================= */
  if (cartItems.length === 0) {
    return <EmptyState message="No items in cart. Add products before checkout." showBackHome />;
  }

  /* ================= UI ================= */
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Box sx={{ mb: 2.5 }}>
        <BackButton />
      </Box>

      <Grid container spacing={3}>
        {/* LEFT FORM */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Checkout
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/* NAME */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Full Name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
                </Grid>

                {/* EMAIL */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                </Grid>

                {/* PHONE */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Phone" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
                </Grid>

                {/* PROVINCE */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name="provinceCode"
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.provinceCode}>
                        <InputLabel>Province</InputLabel>
                        <Select label="Province" {...field}>
                          {provinces.map((p) => (
                            <MenuItem key={p.code} value={String(p.code)}>
                              {p.name}
                            </MenuItem>
                          ))}
                        </Select>

                        <Typography variant="caption" color="error">
                          {errors.provinceCode?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* WARD */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name="wardCode"
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!provinceCode || loadingWards} error={!!errors.wardCode}>
                        <InputLabel>Ward</InputLabel>
                        <Select label="Ward" {...field}>
                          {wards.map((w) => (
                            <MenuItem key={w.code} value={String(w.code)}>
                              {w.name}
                            </MenuItem>
                          ))}
                        </Select>

                        <Typography variant="caption" color="error">
                          {errors.wardCode?.message}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* ADDRESS */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={3}
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>

                {/* DATE */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="deliveryDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Delivery Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date ? date.format("YYYY-MM-DD") : "")}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.deliveryDate,
                            helperText: errors.deliveryDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* NOTE */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Order note" {...register("note")} error={!!errors.note} helperText={errors.note?.message} />
                </Grid>
              </Grid>

              {/* ERROR */}
              {submitError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {submitError}
                </Alert>
              )}

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={submitting}>
                {submitting ? "Placing order..." : "Place Order"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SUMMARY */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
            <Typography variant="h6">Order Summary</Typography>

            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {cartItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    {item.title} x{item.quantity}
                  </Typography>

                  <Typography sx={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
            </Stack>

            <Typography sx={{ mt: 2, fontWeight: 700 }}>Total: ${Number(totalPrice).toFixed(2)}</Typography>

            {selectedProvince && <Typography color="text.secondary">Province: {selectedProvince.name}</Typography>}

            {selectedWard && <Typography color="text.secondary">Ward: {selectedWard.name}</Typography>}
          </Paper>
        </Grid>
      </Grid>

      {/* SUCCESS */}
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Order placed successfully!</Alert>
      </Snackbar>
    </Container>
  );
};

export default CheckoutPage;
