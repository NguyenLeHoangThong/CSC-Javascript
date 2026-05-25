export interface Grade {
  id: number;
  studentId: number;
  classId: number;
  subject: string;
  midterm: number;
  final: number;
  average: number;
  grade: string;
  recordedAt: string;
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
