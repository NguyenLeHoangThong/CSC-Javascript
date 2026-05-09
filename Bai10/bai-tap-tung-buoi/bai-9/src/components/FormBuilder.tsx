import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, type Path, type DefaultValues, type FieldValues } from "react-hook-form";

// Interface dùng generic T để type-safe field names
interface FormField<T> {
  name: Path<T>;       // Path<T> đảm bảo name phải là key hợp lệ của T
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

// Generic component — T được infer từ props khi dùng
export function FormBuilder<T extends FieldValues>({
  title,
  initialValues,
  fields,
  onSubmit,
}: FormBuilderProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>({ defaultValues: initialValues });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5" fontWeight={700}>{title}</Typography>
      {fields.map((field) => (
        <TextField
          key={field.name.toString()}
          label={field.label}
          type={field.type ?? "text"}
          {...register(field.name, {
            required: field.required ? `${field.label} không được để trống` : false,
          })}
          error={!!errors[field.name]}
          helperText={errors[field.name]?.message as string | undefined}
        />
      ))}
      <Button type="submit" variant="contained">Xác nhận</Button>
    </Box>
  );
}
