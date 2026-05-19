import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { checkoutSchema } from "../schemas/checkoutSchema";

const inputStyle = (hasError) => ({
  width: "100%",
  padding: "8px 12px",
  boxSizing: "border-box",
  borderRadius: 6,
  border: `1px solid ${hasError ? "#e53935" : "#ddd"}`,
  fontSize: 15,
  outline: "none",
});

const errorStyle = { color: "#e53935", fontSize: 13, margin: "4px 0 0" };

const PROVINCES = [
  { value: "hanoi", label: "Ha Noi" },
  { value: "hcm", label: "Ho Chi Minh City" },
  { value: "danang", label: "Da Nang" },
  { value: "cantho", label: "Can Tho" },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: { name: "", email: "", phone: "", province: "", address: "", deliveryDate: "", note: "" },
  });

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
        <h2 style={{ color: "#2e7d32" }}>✅ Order placed successfully!</h2>
        <p>Thank you for your purchase. We will contact you soon.</p>
        <button onClick={() => { setSuccess(false); navigate("/"); }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Full Name <span style={{ color: "red" }}>*</span></label>
          <input {...register("name")}
            placeholder="John Doe"
            style={inputStyle(!!errors.name)}
          />
          {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Email <span style={{ color: "red" }}>*</span></label>
          <input {...register("email")}
            type="email"
            placeholder="example@email.com"
            style={inputStyle(!!errors.email)}
          />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Phone <span style={{ color: "red" }}>*</span></label>
          <input {...register("phone")}
            placeholder="0901234567"
            style={inputStyle(!!errors.phone)}
          />
          {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Province/City <span style={{ color: "red" }}>*</span></label>
          <select {...register("province")}
            style={{ ...inputStyle(!!errors.province), height: 40 }}
            defaultValue=""
          >
            <option value="" disabled>Select province/city</option>
            {PROVINCES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {errors.province && <p style={errorStyle}>{errors.province.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Address <span style={{ color: "red" }}>*</span></label>
          <textarea {...register("address")}
            placeholder="123 ABC Street, District 1"
            rows={2}
            style={inputStyle(!!errors.address)}
          />
          {errors.address && <p style={errorStyle}>{errors.address.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Delivery Date <span style={{ color: "red" }}>*</span></label>
          <input {...register("deliveryDate")}
            type="date"
            style={inputStyle(!!errors.deliveryDate)}
          />
          {errors.deliveryDate && <p style={errorStyle}>{errors.deliveryDate.message}</p>}
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Note</label>
          <textarea {...register("note")}
            placeholder="Additional note (optional)"
            rows={2}
            style={inputStyle(false)}
          />
          {errors.note && <p style={errorStyle}>{errors.note.message}</p>}
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{ width: "100%", padding: "12px", background: submitting ? "#aaa" : "#0B74E5", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}
        >
          {submitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;