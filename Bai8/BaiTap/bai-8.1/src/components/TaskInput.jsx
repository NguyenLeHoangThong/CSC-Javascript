import React, { useState, useContext } from 'react';
import { Box, TextField, Button, MenuItem, Stack } from '@mui/material';
import { TaskContext } from '../contexts/TaskContext';

export default function TaskInput() {
  const { addTask } = useContext(TaskContext);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleAdd = () => {
    if (text.trim()) {
      addTask(text, priority);
      setText("");
    }
  };

  return (
    <Box sx={{ mb: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Nội dung công việc..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <TextField
          select
          label="Ưu tiên"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {['Urgent', 'High', 'Medium', 'Low'].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleAdd} sx={{ px: 4 }}>
          Thêm
        </Button>
      </Stack>
    </Box>
  );
}