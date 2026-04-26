import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  Stack,
  Avatar,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Badge,
  Button,
  TextField,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { TodoService } from "./services/todoService";
import { UserService } from "./services/userService";

export default function TaskAssignment() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("all");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { title: "", userId: "" },
  });

  // 1. Phối hợp gọi đồng thời 2 API
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [todosRes, usersRes] = await Promise.all([TodoService.getAll(), UserService.getAll()]);
        setTasks(todosRes);
        setUsers(usersRes);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // 2. Logic khớp User vào Task
  const getAssignee = (userId) => {
    return users.find((u) => u.id === userId) || { name: "Unknown", email: "N/A" };
  };

  // 3. Xử lý thêm mới
  const onAddTask = async (data) => {
    const newTask = await TodoService.create({ ...data, completed: false });
    // Giả lập ID để UI không lỗi
    setTasks([{ ...newTask, id: Date.now() }, ...tasks]);
    reset();
  };

  // 4. Cập nhật trạng thái Task
  const toggleStatus = async (id, currentStatus) => {
    await TodoService.update(id, { completed: !currentStatus });
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !currentStatus } : t)));
  };

  // 5. Lọc danh sách
  const filteredTasks = tasks.filter((t) => (selectedUser === "all" ? true : t.userId === selectedUser));

  return (
    <Container sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={900}>
          TASK BOARD
        </Typography>
        <Badge badgeContent={filteredTasks.length} color="primary">
          <Chip label="Total Tasks" variant="outlined" />
        </Badge>
      </Stack>

      <Grid container spacing={4}>
        {/* CỘT TRÁI: FORM THÊM TASK */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              Giao việc mới
            </Typography>
            <form onSubmit={handleSubmit(onAddTask)}>
              <Stack spacing={3}>
                <Controller name="title" control={control} render={({ field }) => <TextField {...field} label="Tên công việc" fullWidth />} />
                <FormControl fullWidth>
                  <InputLabel>Người phụ trách</InputLabel>
                  <Controller
                    name="userId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Người phụ trách">
                        {users.map((u) => (
                          <MenuItem key={u.id} value={u.id}>
                            {u.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                <Button type="submit" variant="contained" size="large">
                  Giao việc
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" mb={1} color="text.secondary">
              Bộ lọc theo nhân viên:
            </Typography>
            <Select fullWidth value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} size="small">
              <MenuItem value="all">Tất cả nhân viên</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </Paper>
        </Grid>

        {/* CỘT PHẢI: DANH SÁCH TASK */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {loading
              ? Array.from(new Array(5)).map((_, i) => <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 2 }} />)
              : filteredTasks.map((task) => {
                  const assignee = getAssignee(task.userId);
                  return (
                    <Card key={task.id} sx={{ p: 2, borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: "secondary.main" }}>{assignee.name[0]}</Avatar>
                          <Box>
                            <Typography fontWeight="bold" sx={{ textDecoration: task.completed ? "line-through" : "none" }}>
                              {task.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Người phụ trách: {assignee.name} ({assignee.email})
                            </Typography>
                          </Box>
                        </Stack>
                        <Chip
                          label={task.completed ? "Done" : "In Progress"}
                          color={task.completed ? "success" : "warning"}
                          onClick={() => toggleStatus(task.id, task.completed)}
                          sx={{ fontWeight: "bold" }}
                        />
                      </Stack>
                    </Card>
                  );
                })}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
