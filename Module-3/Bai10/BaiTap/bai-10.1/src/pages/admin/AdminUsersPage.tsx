import { Chip, Container, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";

import Loading from "../../components/common/Loading";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

type Row = { id: number; name: string; email: string; role: "user" | "admin" };

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => userApi.getAll({ limit: 100 }).then((res) => setUsers(res.data.data));

  useEffect(() => {
    loadUsers().finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>Quản lý người dùng</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell><TableCell>Tên</TableCell><TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell><TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => {
            const isSelf = u.id === currentUser?.id; // disable self role-change / self-delete
            return (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Chip label={u.role} color={u.role === "admin" ? "primary" : "default"} size="small" /></TableCell>
                <TableCell align="right">
                  <IconButton
                    title="Đổi vai trò"
                    disabled={isSelf}
                    onClick={async () => { await userApi.updateRole(u.id, u.role === "admin" ? "user" : "admin"); loadUsers(); }}
                  >
                    <SwapHorizIcon />
                  </IconButton>
                  <IconButton
                    title="Xóa"
                    disabled={isSelf}
                    onClick={async () => { await userApi.remove(u.id); loadUsers(); }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminUsersPage;
