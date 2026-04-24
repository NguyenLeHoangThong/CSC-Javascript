import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "./schema";
import styles from "./styles.module.css";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const noteContent = watch("note", "");

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Giả lập API

    // Lưu vào Local Storage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify([...existingUsers, { ...data, id: Date.now() }]));

    alert("Đăng ký thành công!");
  };

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Đăng Ký Khóa Học</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <input {...register("fullName")} className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`} placeholder="Họ tên" />
          {errors.fullName && <span className={styles.errorText}>{errors.fullName.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <input {...register("email")} className={`${styles.input} ${errors.email ? styles.inputError : ""}`} placeholder="Email" />
          {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            {...register("password")}
            className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
            placeholder="Mật khẩu"
          />
          {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <textarea {...register("note")} className={styles.textarea} placeholder="Ghi chú..." rows={3} />
          <div className={styles.charCount}>{noteContent.length} / 50</div>
          {errors.note && <span className={styles.errorText}>{errors.note.message}</span>}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : "Xác nhận đăng ký"}
        </button>
      </form>
    </div>
  );
}
