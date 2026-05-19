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
    defaultValues: { name: "", email: "", phone: "", address: "", note: "" },
  });

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Đặt hàng:", formData);
      setSuccess(true);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
        <h2 style={{ color: "#2e7d32" }}>✅ Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ sớm.</p>
        <button onClick={() => { setSuccess(false); navigate("/"); }}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <h2>Đặt hàng</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Họ tên <span style={{ color: "red" }}>*</span></label>
          <input {...register("name")} placeholder="Nguyễn Văn A" style={inputStyle(!!errors.name)} />
          {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Email <span style={{ color: "red" }}>*</span></label>
          <input {...register("email")} type="email" placeholder="example@email.com" style={inputStyle(!!errors.email)} />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Số điện thoại <span style={{ color: "red" }}>*</span></label>
          <input {...register("phone")} placeholder="0901234567" style={inputStyle(!!errors.phone)} />
          {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Địa chỉ <span style={{ color: "red" }}>*</span></label>
          <textarea {...register("address")} placeholder="123 Đường ABC, Quận 1, TP.HCM" rows={3} style={inputStyle(!!errors.address)} />
          {errors.address && <p style={errorStyle}>{errors.address.message}</p>}
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Ghi chú</label>
          <textarea {...register("note")} placeholder="Ghi chú thêm (không bắt buộc)" rows={2} style={inputStyle(false)} />
          {errors.note && <p style={errorStyle}>{errors.note.message}</p>}
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{ width: "100%", padding: "12px", background: submitting ? "#aaa" : "#0B74E5", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}
        >
          {submitting ? "Đang đặt hàng..." : "Đặt hàng"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
