import * as yup from 'yup';

// Each item carries a snapshot of title/price/thumbnail (sent by the frontend cart).
export const orderItemSchema = yup.object({
  productId: yup.number().integer().positive().required(),
  title: yup.string().required(),
  price: yup.number().positive().required(),
  quantity: yup.number().integer().positive().required(),
  thumbnail: yup.string().required(),
});

export const orderStatusSchema = yup.object({
  status: yup.string().oneOf(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']).required(),
});

export const createOrderSchema = yup.object({
  userName: yup.string().min(2).max(100).required(),
  userEmail: yup.string().email().max(150).required(),
  userPhone: yup.string().max(15).required(),
  address: yup.string().min(5).required(),
  provinceCode: yup.string().max(20).nullable(),
  wardCode: yup.string().max(20).nullable(),
  deliveryDate: yup.date().nullable(),
  note: yup.string().nullable(),
  items: yup.array().of(orderItemSchema).min(1, 'Đơn hàng phải có ít nhất 1 sản phẩm').required(),
});
