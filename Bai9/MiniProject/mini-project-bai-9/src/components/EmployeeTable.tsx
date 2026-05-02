import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import type { Employee } from "../types/employee";

interface Props {
  data: Employee[];
  loading: boolean;
}

const EmployeeTable: React.FC<Props> = ({ data, loading }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ bgcolor: "#eee" }}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Họ và tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Đang tải...
              </TableCell>
            </TableRow>
          ) : (
            data.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.fullName}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>
                  <b>{emp.status}</b>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;
