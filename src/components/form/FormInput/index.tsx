import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import { useController, useFormContext } from "react-hook-form";

export interface FormInputProps extends Omit<TextFieldProps, "name"> {
  name: string;
}

export function FormInput({ name, helperText, ...props }: FormInputProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <TextField
      {...field}
      {...props}
      error={!!fieldState.error}
      helperText={fieldState.error?.message ?? helperText ?? " "}
      fullWidth
      size="small"
    />
  );
}
