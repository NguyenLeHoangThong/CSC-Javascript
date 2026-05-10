import * as yup from "yup";

export const checkoutSchema = yup.object({
  name: yup.string().trim().min(2, "Name must be at least 2 characters").required("Name is required"),

  email: yup.string().trim().email("Invalid email").required("Email is required"),

  phone: yup
    .string()
    .trim()
    .matches(/^(0|\+84)\d{9,10}$/, "Invalid phone number")
    .required("Phone is required"),

  address: yup.string().trim().min(8, "Address must be at least 8 characters").required("Address is required"),

  provinceCode: yup.string().required("Please select a province"),

  deliveryDate: yup
    .string()
    .required("Delivery date is required")
    .test("future-date", "Delivery date must be from tomorrow", (value) => {
      if (!value) return false;

      const selected = new Date(value);

      const tomorrow = new Date();

      tomorrow.setDate(tomorrow.getDate() + 1);

      tomorrow.setHours(0, 0, 0, 0);

      return selected >= tomorrow;
    }),

  note: yup.string().max(300, "Note must be at most 300 characters").required(),
});

export type CheckoutFormData = yup.InferType<typeof checkoutSchema>;
