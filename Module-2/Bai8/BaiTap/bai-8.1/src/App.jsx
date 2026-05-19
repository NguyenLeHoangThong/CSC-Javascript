import React, { useContext, useState, useMemo } from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import { TaskContext, TaskProvider } from './contexts/TaskContext';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import TaskFilter from './components/TaskFilter';

function TaskApp() {
  const { tasks, toggleTask, deleteTask } = useContext(TaskContext);
  
  // State phục vụ việc lọc
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState([]);

  // Logic lọc phức tạp dùng useMemo để tối ưu
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchStatus = filter === "all" 
        ? true 
        : filter === "completed" ? task.completed : !task.completed;
      
      const matchPriority = priorityFilter.length === 0 
        ? true 
        : priorityFilter.includes(task.priority);
        
      return matchStatus && matchPriority;
    });
  }, [tasks, filter, priorityFilter]);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, color: '#1976d2' }}>
        TASK MASTER PRO
      </Typography>
      
      <TaskInput />
      
      <TaskFilter 
        filter={filter} setFilter={setFilter} 
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} 
      />

      <Divider sx={{ mb: 3 }} />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
          Danh sách: {filteredTasks.length} công việc
        </Typography>
        
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={toggleTask} 
              onDelete={deleteTask} 
            />
          ))
        ) : (
          <Typography align="center" sx={{ mt: 4, color: 'text.disabled' }}>
            Không tìm thấy công việc nào phù hợp.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

// Bọc Provider ở ngoài cùng để toàn bộ App dùng được Context[cite: 1]
export default function App() {
  return (
    <TaskProvider>
      <TaskApp />
    </TaskProvider>
  );
}