import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "./schema";
import styles from "./styles.module.css";

export default function ProductForm() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(productSchema)
  });

  const desc = watch("description", "");

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 2000));
    alert("Tin của bạn đã được đăng thành công!");
  };

  return (
    <div className={styles.container}>
      <h2>Đăng tin rao vặt</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title")} className={styles.input} placeholder="Tiêu đề tin (Ví dụ: iPhone 15 Pro Max...)" />
        {errors.title && <p className={styles.err}>{errors.title.message}</p>}

        <input {...register("price")} className={styles.input} placeholder="Giá bán (VNĐ)" />
        {errors.price && <p className={styles.err}>{errors.price.message}</p>}

        <textarea {...register("description")} className={styles.area} placeholder="Mô tả tình trạng sản phẩm..." />
        <div className={styles.charCount}>
          <span className={desc.length < 20 ? styles.low : ""}>{desc.length}</span> / 200 ký tự
        </div>
        {errors.description && <p className={styles.err}>{errors.description.message}</p>}

        <button disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? "Đang tải tin..." : "Đăng tin ngay"}
        </button>
      </form>
    </div>
  );
}