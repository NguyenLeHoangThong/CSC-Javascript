import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { corpSchema } from "./schema";
import styles from "./styles.module.css";

export default function CorpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(corpSchema),
  });

  const onSubmit = (data) => {
    const list = JSON.parse(localStorage.getItem("companies") || "[]");
    localStorage.setItem("companies", JSON.stringify([...list, { email: data.email, web: data.website }]));
    alert("Yêu cầu hợp tác đã được ghi nhận!");
  };

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Đăng ký Đối tác Doanh nghiệp</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <input {...register("email")} placeholder="Email doanh nghiệp" />
          {errors.email && <small className={styles.error}>{errors.email.message}</small>}
        </div>

        <div className={styles.row}>
          <input {...register("website")} placeholder="Website công ty (https://example.com)" />
          {errors.website && <small className={styles.error}>{errors.website.message}</small>}
        </div>

        <div className={styles.row}>
          <input type="password" {...register("password")} placeholder="Mật khẩu bảo mật" />
          {errors.password && <small className={styles.error}>{errors.password.message}</small>}
        </div>

        <div className={styles.row}>
          <input type="password" {...register("confirmPassword")} placeholder="Xác nhận mật khẩu" />
          {errors.confirmPassword && <small className={styles.error}>{errors.confirmPassword.message}</small>}
        </div>

        <div className={styles.checkRow}>
          <input type="checkbox" {...register("agree")} id="agree" />
          <label htmlFor="agree">Tôi đồng ý với các chính sách bảo mật</label>
          {errors.agree && <p className={styles.error}>{errors.agree.message}</p>}
        </div>

        <button className={styles.submitBtn}>Gửi hồ sơ đăng ký</button>
      </form>
    </div>
  );
}
