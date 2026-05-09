import { Container, Typography, Paper, Box, Alert } from "@mui/material";
import { useState } from "react";
import { FormBuilder } from "../components/FormBuilder";

// Định nghĩa type cho form — TypeScript sẽ type-check tất cả field names
interface LoginForm {
  email: string;
  password: string;
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const FormDemoPage = () => {
  const [loginResult, setLoginResult] = useState<LoginForm | null>(null);
  const [contactResult, setContactResult] = useState<ContactForm | null>(null);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={800} mb={4}>
        FormBuilder Generic Demo
      </Typography>

      {/* Form 1: LoginForm */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} variant="outlined">
        <FormBuilder<LoginForm>
          title="Đăng nhập"
          initialValues={{ email: "", password: "" }}
          fields={[
            { name: "email", label: "Email", required: true },
            { name: "password", label: "Mật khẩu", type: "password", required: true },
          ]}
          onSubmit={(data) => setLoginResult(data)}
        />
        {loginResult && (
          <Box mt={2}>
            <Alert severity="success">
              Login: {loginResult.email}
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Form 2: ContactForm */}
      <Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
        <FormBuilder<ContactForm>
          title="Liên hệ"
          initialValues={{ name: "", email: "", message: "" }}
          fields={[
            { name: "name", label: "Họ tên", required: true },
            { name: "email", label: "Email", required: true },
            { name: "message", label: "Tin nhắn", required: true },
          ]}
          onSubmit={(data) => setContactResult(data)}
        />
        {contactResult && (
          <Box mt={2}>
            <Alert severity="success">
              Gửi từ: {contactResult.name} ({contactResult.email})
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FormDemoPage;
