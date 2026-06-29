import * as yup from 'yup';

export const employeeQuerySchema = yup.object({
  departmentId: yup.number().integer().positive().optional(),
  status: yup.string().oneOf(['active', 'inactive', 'resigned']).optional(),
  search: yup.string().max(100).optional(),
  sort: yup.string().oneOf(['fullName', 'salary', 'startDate']).default('fullName'),
  order: yup.string().oneOf(['asc', 'desc']).default('asc'),
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
});

export const createEmployeeSchema = yup.object({
  fullName: yup.string().min(2).max(100).required(),
  email: yup.string().email().max(150).required(),
  phone: yup.string().max(15).nullable(),
  departmentId: yup.number().integer().positive().nullable(),
  position: yup.string().min(2).max(100).required(),
  salary: yup.number().min(0).required(),
  startDate: yup.date().required(),
  status: yup.string().oneOf(['active', 'inactive', 'resigned']).default('active'),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const createDepartmentSchema = yup.object({
  name: yup.string().min(2).max(100).required(),
  code: yup.string().min(2).max(20).required(),
});
