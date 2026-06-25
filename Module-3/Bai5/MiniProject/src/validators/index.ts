import * as yup from 'yup';

// ============================================
// Class Validators
// ============================================
export const classCreateSchema = yup.object().shape({
  name: yup.string().required('Tên lớp là bắt buộc').min(2).max(100),
  subject: yup.string().required('Môn học là bắt buộc').min(2).max(50),
  teacherName: yup.string().required('Tên giáo viên là bắt buộc').min(2).max(100),
  maxStudents: yup
    .number()
    .required('Số học sinh tối đa là bắt buộc')
    .min(1)
    .max(100),
  schedule: yup.string().nullable().max(255),
});

// ============================================
// Student Validators
// ============================================
export const studentCreateSchema = yup.object().shape({
  fullName: yup.string().required('Họ tên là bắt buộc').min(2).max(100),
  email: yup.string().required('Email là bắt buộc').email().max(150),
  phone: yup.string().nullable().max(15),
  classId: yup.number().nullable().positive(),
  gpa: yup
    .number()
    .nullable()
    .min(0)
    .max(4)
    .default(0),
  status: yup
    .string()
    .nullable()
    .oneOf(['active', 'inactive', 'graduated'])
    .default('active'),
});

export const studentUpdateSchema = yup.object().shape({
  fullName: yup.string().min(2).max(100),
  email: yup.string().email().max(150),
  phone: yup.string().nullable().max(15),
  classId: yup.number().nullable().positive(),
  gpa: yup.number().nullable().min(0).max(4),
  status: yup.string().oneOf(['active', 'inactive', 'graduated']),
});

// ============================================
// Grade Validators
// ============================================
export const gradeCreateSchema = yup.object().shape({
  subject: yup.string().required('Môn học là bắt buộc').min(2).max(50),
  midterm: yup
    .number()
    .required('Điểm giữa kỳ là bắt buộc')
    .min(0)
    .max(10),
  final: yup
    .number()
    .required('Điểm cuối kỳ là bắt buộc')
    .min(0)
    .max(10),
});
