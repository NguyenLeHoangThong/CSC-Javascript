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
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import dayjs from "dayjs";

import BackButton from "../components/common/BackButton";
import { createOrder } from "../services/orderService";
import { getProvinces } from "../services/locationService";
import { checkoutSchema } from "../schemas/checkoutSchema";

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

  const [provinces, setProvinces] = useState([]);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const getProvinceName = (code) => {
    return provinces.find((p) => String(p.code) === String(code))?.name || "";
  };

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setSubmitError("");

      const shippingProvince = getProvinceName(formData.provinceCode);

      await createOrder({
        ...formData,
        shippingProvince,
      });

      setSuccess(true);
      reset();
    } catch {
      setSubmitError("Cannot place order now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <BackButton />
        </Box>

        <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 6 }}>
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 600 }}>
            Checkout
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Full Name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
              </Grid>

              {/* Phone */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Phone" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
              </Grid>

              {/* Province */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  control={control}
                  name="provinceCode"
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.provinceCode}>
                      <InputLabel>Province / City</InputLabel>

                      <Select {...field} label="Province / City">
                        {loadingProvince && <MenuItem value="">Loading...</MenuItem>}

                        {provinces.map((item) => (
                          <MenuItem key={item.code} value={String(item.code)}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>

                      {errors.provinceCode && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.provinceCode.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Address */}
              <Grid size={12}>
                <TextField fullWidth label="Address" multiline rows={4} {...register("address")} />
              </Grid>

              {/* Delivery Date */}
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

              {/* Note */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Order note" {...register("note")} />
              </Grid>
            </Grid>

            {submitError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {submitError}
              </Alert>
            )}

            <Button type="submit" variant="contained" fullWidth disabled={submitting} sx={{ mt: 5, py: 1.8, borderRadius: 3, fontWeight: 700 }}>
              {submitting ? "Placing order..." : "Place Order"}
            </Button>
          </Box>
        </Paper>

        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" variant="filled">
            Order placed successfully!
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default CheckoutPage;
