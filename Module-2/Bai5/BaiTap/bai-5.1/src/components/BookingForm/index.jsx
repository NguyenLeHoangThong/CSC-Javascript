import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookingSchema } from "./schema";
import styles from "./styles.module.css";

export default function BookingForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bookingSchema),
  });

  const selectedService = watch("service");

  const onSubmit = (data) => console.log("Lịch hẹn:", data);

  return (
    <div className={styles.wrapper}>
      <h3>Đặt lịch khám trực tuyến</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.group}>
          <input {...register("fullName")} placeholder="Họ và tên khách hàng" />
          {errors.fullName && <small>{errors.fullName.message}</small>}
        </div>

        <div className={styles.group}>
          <input {...register("phone")} placeholder="Số điện thoại liên lạc" />
          {errors.phone && <small>{errors.phone.message}</small>}
        </div>

        <div className={styles.group}>
          <select {...register("service")}>
            <option value="">-- Chọn dịch vụ --</option>
            <option value="general">Khám tổng quát</option>
            <option value="dental">Nha khoa</option>
            <option value="other">Dịch vụ khác...</option>
          </select>
          {errors.service && <small>{errors.service.message}</small>}
        </div>

        {selectedService === "other" && (
          <div className={styles.group}>
            <textarea {...register("otherDetail")} placeholder="Mô tả chi tiết tình trạng của bạn" />
            {errors.otherDetail && <small>{errors.otherDetail.message}</small>}
          </div>
        )}

        <button className={styles.btn}>Xác nhận đặt lịch</button>
      </form>
    </div>
  );
}
