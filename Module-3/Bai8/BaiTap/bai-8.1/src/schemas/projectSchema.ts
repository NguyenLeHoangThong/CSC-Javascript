import * as yup from 'yup';

export const createProjectSchema = yup.object({
  name: yup.string().min(2).max(200).required(),
  description: yup.string().nullable(),
  status: yup.string().oneOf(['planning', 'active', 'completed', 'archived']).default('planning'),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createTaskSchema = yup.object({
  title: yup.string().min(2).max(200).required(),
  description: yup.string().nullable(),
  assigneeId: yup.number().integer().positive().nullable(),
  priority: yup.string().oneOf(['low', 'medium', 'high']).default('medium'),
  status: yup.string().oneOf(['todo', 'in_progress', 'done']).default('todo'),
  dueDate: yup.date().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();
