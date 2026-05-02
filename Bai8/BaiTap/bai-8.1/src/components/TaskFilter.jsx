import React from 'react';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function TaskFilter({ filter, setFilter, priorityFilter, setPriorityFilter }) {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Trạng thái:</Typography>
        <ToggleButtonGroup
          color="primary"
          value={filter}
          exclusive
          onChange={(e, val) => val !== null && setFilter(val)}
        >
          <ToggleButton value="all">Tất cả</ToggleButton>
          <ToggleButton value="active">Chưa xong</ToggleButton>
          <ToggleButton value="completed">Đã xong</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Mức độ ưu tiên:</Typography>
        <ToggleButtonGroup
          size="small"
          value={priorityFilter}
          onChange={(e, val) => setPriorityFilter(val)}
        >
          <ToggleButton value="Urgent">Urgent</ToggleButton>
          <ToggleButton value="High">High</ToggleButton>
          <ToggleButton value="Medium">Medium</ToggleButton>
          <ToggleButton value="Low">Low</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
}