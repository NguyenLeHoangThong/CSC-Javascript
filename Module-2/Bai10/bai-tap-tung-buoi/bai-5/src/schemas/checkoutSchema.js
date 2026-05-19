import * as yup from "yup";

export const checkoutSchema = yup.object({
  name: yup.string().trim().min(2, "Full name must be at least 2 characters").required("Full name is required"),
  email: yup.string().trim().email("Invalid email format").required("Email is required"),
  phone: yup
    .string()
    .trim()
    .matches(/^(0|\+84)\d{9,10}$/, "Invalid phone number")
    .required("Phone is required"),
  province: yup.string().required("Province/City is required"),
  address: yup.string().trim().min(8, "Address must be at least 8 characters").required("Address is required"),
  deliveryDate: yup.string().required("Delivery date is required"),
  note: yup.string().max(300, "Note can be up to 300 characters").optional(),
});
