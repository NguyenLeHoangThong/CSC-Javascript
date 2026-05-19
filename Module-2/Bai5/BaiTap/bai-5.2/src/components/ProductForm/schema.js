import * as yup from "yup";
export const productSchema = yup.object({
  title: yup.string().min(10, "Tiêu đề quá ngắn").max(50, "Tiêu đề quá dài").required("Bắt buộc nhập"),
  price: yup.number().typeError("Giá phải là con số").min(1000, "Giá thấp nhất là 1,000đ").required(),
  description: yup.string().min(20, "Mô tả sản phẩm cần chi tiết hơn").required()
});