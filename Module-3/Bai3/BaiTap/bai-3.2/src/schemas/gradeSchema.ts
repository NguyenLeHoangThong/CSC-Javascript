import * as yup from "yup";

export const createGradeSchema = yup.object({
  studentId: yup.number().integer().positive().required(),
  classId: yup.number().integer().positive().required(),
  subject: yup.string().min(1).required(),
  midterm: yup.number().min(0, "Điểm không được âm").max(10, "Điểm tối đa 10").required(),
  final: yup.number().min(0).max(10).required(),
});

export const updateGradeSchema = yup
  .object({
    midterm: yup.number().min(0).max(10).optional(),
    final: yup.number().min(0).max(10).optional(),
  })
  .test(
    "at-least-one",
    "Phải có midterm hoặc final",
    (v) => v.midterm !== undefined || v.final !== undefined
  );

export type CreateGradeInput = yup.InferType<typeof createGradeSchema>;
