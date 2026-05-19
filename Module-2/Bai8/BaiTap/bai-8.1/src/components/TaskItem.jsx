import React from "react";
import { Paper, Checkbox, IconButton, Typography, Chip, Stack, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskItem = React.memo(({ task, onToggle, onDelete }) => {
  console.log(`=> Render TaskItem: ${task.text}`);

  const getPriorityColor = (p) => {
    switch (p) {
      case "Urgent":
        return "error";
      case "High":
        return "warning";
      case "Medium":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
        <Box>
          <Typography sx={{ textDecoration: task.completed ? "line-through" : "none", fontWeight: 500 }}>{task.text}</Typography>
          <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} sx={{ mt: 0.5 }} />
        </Box>
      </Stack>
      <IconButton onClick={() => onDelete(task.id)} color="error">
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
});

export default TaskItem;
