import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { useController, useFormContext } from "react-hook-form";

export interface FormCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
}

export function FormCheckbox({ name, label, disabled }: FormCheckboxProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <FormControl error={!!fieldState.error}>
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            checked={Boolean(field.value)}
            disabled={disabled}
            size="small"
          />
        }
        label={label}
      />
      {fieldState.error && (
        <FormHelperText>{fieldState.error.message}</FormHelperText>
      )}
    </FormControl>
  );
}
