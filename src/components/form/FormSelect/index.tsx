import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useController, useFormContext } from "react-hook-form";

export interface FormSelectProps {
  name: string;
  label: string;
  options: ReadonlyArray<string>;
  required?: boolean;
  disabled?: boolean;
}

export function FormSelect({
  name,
  label,
  options,
  required,
  disabled,
}: FormSelectProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const labelId = `${name}-label`;

  return (
    <FormControl
      fullWidth
      size="small"
      error={!!fieldState.error}
      required={required}
      disabled={disabled}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select {...field} labelId={labelId} label={label}>
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message ?? " "}</FormHelperText>
    </FormControl>
  );
}
