import * as yup from 'yup';

export const createPostSchema = yup.object({
  title: yup.string().min(2).max(200).required(),
  content: yup.string().min(1).required(),
  published: yup.boolean().default(false),
});

export const updatePostSchema = yup.object({
  title: yup.string().min(2).max(200),
  content: yup.string().min(1),
  published: yup.boolean(),
});
