// types/employee.ts
export type EmployeeStatus = "Active" | "Inactive" | "On Leave";

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  position: string;
  status: EmployeeStatus;
}

export interface EmployeeFormInput {
  fullName: string;
  email: string;
  position: string;
  status: EmployeeStatus;
}