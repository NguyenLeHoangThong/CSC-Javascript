import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("smart_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("smart_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((text, priority) => {
    const newTask = { id: Date.now(), text, priority, completed: false, createdAt: new Date() };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const value = useMemo(() => ({ tasks, addTask, deleteTask, toggleTask }), [tasks, addTask, deleteTask, toggleTask]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
