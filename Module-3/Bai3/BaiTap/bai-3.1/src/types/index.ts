export interface Class {
  id: number;
  name: string;
  subject: string;
  teacherName: string;
  maxStudents: number;
  currentStudents: number;
  schedule: string;
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
