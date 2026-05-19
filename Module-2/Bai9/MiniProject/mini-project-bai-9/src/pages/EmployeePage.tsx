import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import type { Employee, EmployeeFormInput } from "../types/employee";
import { employeeService } from "../services/employeeService";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    const data = await employeeService.getAll();
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAddEmployee = async (formData: EmployeeFormInput) => {
    try {
      const newEmp = await employeeService.create(formData);
      setEmployees([...employees, newEmp]);
      alert("Thành công!");
    } catch (e) {
      alert("Lỗi!");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Dashboard Nhân Sự
      </Typography>
      <EmployeeForm onAddSuccess={handleAddEmployee} />
      <EmployeeTable data={employees} loading={loading} />
    </Container>
  );
};

export default EmployeePage;
