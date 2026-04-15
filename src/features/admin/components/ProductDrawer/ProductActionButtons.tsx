import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useFormContext } from "react-hook-form";

interface ProductActionButtonsProps {
  onCancel: () => void;
  isPending?: boolean;
}

export function ProductActionButtons({
  onCancel,
  isPending = false,
}: ProductActionButtonsProps) {
  const { formState } = useFormContext();
  const isDisabled = formState.isSubmitting || isPending;

  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 3 }}>
      <Button variant="outlined" onClick={onCancel} disabled={isDisabled}>
        Cancel
      </Button>
      <Button type="submit" variant="contained" disabled={isDisabled}>
        {isPending ? "Saving…" : "Save"}
      </Button>
    </Stack>
  );
}
