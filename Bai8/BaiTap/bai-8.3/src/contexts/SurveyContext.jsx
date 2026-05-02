import React, { createContext, useState } from "react";

export const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    hobbies: [],
    color: "",
    agree: false,
  });

  const updateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return <SurveyContext.Provider value={{ formData, updateData }}>{children}</SurveyContext.Provider>;
};
