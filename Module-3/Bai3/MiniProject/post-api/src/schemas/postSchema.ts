import * as yup from "yup";

export const createPostSchema = yup.object({
  title: yup.string().min(1, "Tiêu đề không được rỗng").required(),
  content: yup.string().min(10, "Nội dung tối thiểu 10 ký tự").required(),
  category: yup.string().min(1).required(),
  tags: yup.array().of(yup.string()).optional(),
});

export const updatePostSchema = createPostSchema.partial();
export type CreatePostInput = yup.InferType<typeof createPostSchema>;
