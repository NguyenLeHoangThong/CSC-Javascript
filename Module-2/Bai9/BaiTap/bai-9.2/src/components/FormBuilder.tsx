import { useForm, type Path, type DefaultValues, type FieldValues } from "react-hook-form";
import { TextField, Button, Stack, Typography, Paper } from "@mui/material";

// Định nghĩa cấu trúc cho mỗi field trong form
interface FormField<T> {
  name: Path<T>;
  label: string;
  type?: string;
  required?: boolean;
}

interface FormBuilderProps<T extends FieldValues> {
  title: string;
  initialValues: DefaultValues<T>;
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
}

export function FormBuilder<T extends FieldValues>({ title, initialValues, fields, onSubmit }: FormBuilderProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>({
    defaultValues: initialValues,
  });

  const handleInternalSubmit = (data: T) => {
    onSubmit(data);
    reset();
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }} elevation={4}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        {title}
      </Typography>
      <form onSubmit={handleSubmit(handleInternalSubmit)}>
        <Stack spacing={3}>
          {fields.map((field) => (
            <TextField
              key={field.name.toString()}
              fullWidth
              label={field.label}
              type={field.type || "text"}
              {...register(field.name, {
                required: field.required ? `${field.label} không được để trống` : false,
              })}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message as string}
              variant="outlined"
            />
          ))}
          <Button type="submit" variant="contained" size="large" fullWidth>
            Xác nhận gửi
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
