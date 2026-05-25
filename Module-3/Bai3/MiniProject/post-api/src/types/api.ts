export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
