import * as yup from "yup";

export const createClassSchema = yup.object({
  name: yup.string().min(1, "Tên lớp không được rỗng").required(),
  subject: yup
    .string()
    .oneOf(["math", "english", "programming", "design"], "Môn học không hợp lệ")
    .required(),
  teacherName: yup.string().min(1).required(),
  maxStudents: yup.number().integer().min(10).max(50).required(),
  currentStudents: yup.number().integer().min(0).required(),
  schedule: yup.string().required(),
});

export const updateClassSchema = createClassSchema.partial();
export type CreateClassInput = yup.InferType<typeof createClassSchema>;
