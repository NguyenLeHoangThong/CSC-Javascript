import * as yup from "yup";
const phoneRegExp = /^(0[3|5|7|8|9])([0-9]{8})$/;

export const bookingSchema = yup.object({
  fullName: yup.string().required("Vui lòng nhập họ tên"),
  phone: yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ").required("Bắt buộc nhập số điện thoại"),
  service: yup.string().required("Vui lòng chọn dịch vụ"),
  otherDetail: yup.string().when("service", {
    is: "other",
    then: (schema) => schema.required("Vui lòng nhập chi tiết yêu cầu")
  })
});