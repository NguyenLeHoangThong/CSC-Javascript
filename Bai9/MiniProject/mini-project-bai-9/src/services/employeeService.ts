// services/employeeService.ts
import axios from "axios";
import type { Employee, EmployeeFormInput, EmployeeStatus } from "../types/employee";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const employeeService = {
  // Lấy danh sách và mapping dữ liệu
  getAll: async (): Promise<Employee[]> => {
    const response = await axios.get(API_URL);
    return response.data.map((user: any) => ({
      id: user.id,
      fullName: user.name, // Map name -> fullName
      email: user.email,
      position: "Developer", // Gán giá trị mặc định
      status: "Active" as EmployeeStatus,
    }));
  },

  // Thêm mới nhân viên (Giả lập)
  create: async (data: EmployeeFormInput): Promise<Employee> => {
    const response = await axios.post(API_URL, data);
    return {
      ...response.data,
      id: Math.floor(Math.random() * 1000), // Tạo ID ngẫu nhiên vì API giả lập luôn trả về id 11
    };
  },
};
