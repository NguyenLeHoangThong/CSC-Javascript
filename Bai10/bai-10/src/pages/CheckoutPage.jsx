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
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import BackButton from "../components/common/BackButton";
import EmptyState from "../components/common/EmptyState";
import { createOrder } from "../services/orderService";
import { getProvinces } from "../services/locationService";
import { useCart } from "../context/CartProvider";
import { checkoutSchema } from "../schemas/checkoutSchema";
import dayjs from "dayjs";

const CheckoutPage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      provinceCode: "",
      deliveryDate: "",
      note: "",
    },
  });
  const { cartItems, totalPrice, dispatch } = useCart();
  const [provinces, setProvinces] = useState([]);
  const [loadingProvince, setLoadingProvince] = useState(false);

  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const provinceCode = useWatch({ control, name: "provinceCode" });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvince(true);
        const data = await getProvinces();
        setProvinces(data);
      } catch {
        setProvinces([]);
      } finally {
        setLoadingProvince(false);
      }
    };
    fetchProvinces();
  }, []);

  const selectedProvince = useMemo(() => {
    return provinces.find((item) => String(item.code) === String(provinceCode));
  }, [provinceCode, provinces]);

  const onSubmit = async (formData) => {
    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");
      await createOrder(
        cartItems.map((item) => ({
          ...item,
          shippingProvince: selectedProvince?.name || "",
          deliveryDate: formData.deliveryDate,
        })),
      );
      setSuccess(true);
      dispatch({ type: "CLEAR_CART" });
      reset();
    } catch {
      setSubmitError("Cannot place order now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return <EmptyState message="No items in cart. Add products before checkout." showBackHome />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Box sx={{ mb: 2.5 }}>
        <BackButton />
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }} variant="outlined">
            <Typography variant="h4" fontWeight={700} mb={3}>
              Checkout
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Full Name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Phone" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name="provinceCode"
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.provinceCode}>
                        <InputLabel>Province / City</InputLabel>
                        <Select label="Province / City" {...field}>
                          {loadingProvince ? <MenuItem value="">Loading...</MenuItem> : null}
                          {provinces.map((item) => (
                            <MenuItem key={item.code} value={String(item.code)}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                          {errors.provinceCode?.message || ""}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Order note" {...register("note")} error={!!errors.note} helperText={errors.note?.message} />
                </Grid>
              </Grid>

              {submitError ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {submitError}
                </Alert>
              ) : null}

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={submitting}>
                {submitting ? "Placing order..." : "Place Order"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }} variant="outlined">
            <Typography variant="h6" fontWeight={700} mb={2}>
              Review your items
            </Typography>
            <Stack spacing={1.5}>
              {cartItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed", borderColor: "divider", pb: 1 }}
                >
                  <Typography variant="body2" sx={{ pr: 1 }}>
                    {item.title} x{item.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Typography variant="h6" mt={2.5}>
              Total: ${Number(totalPrice).toFixed(2)}
            </Typography>
            {selectedProvince ? (
              <Typography color="text.secondary" mt={1}>
                Shipping to: {selectedProvince.name}
              </Typography>
            ) : null}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Order placed successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CheckoutPage;
