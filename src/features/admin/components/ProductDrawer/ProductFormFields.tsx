import { FormCheckbox, FormInput, FormSelect } from "@components/form";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
} from "@features/products/schemas/product.schema";
import Box from "@mui/material/Box";

export function ProductFormFields() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormInput name="name" label="Name" required />
      <FormSelect
        name="category"
        label="Category"
        options={PRODUCT_CATEGORIES}
        required
      />
      <FormInput
        name="price"
        label="Price ($)"
        type="number"
        required
        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
      />
      <FormInput
        name="stock"
        label="Stock"
        type="number"
        required
        slotProps={{ htmlInput: { min: 0, step: 1 } }}
      />
      <FormSelect
        name="condition"
        label="Condition"
        options={PRODUCT_CONDITIONS}
        required
      />
      <FormCheckbox name="isFeatured" label="Featured product" />
      <FormInput name="description" label="Description" multiline rows={3} />
    </Box>
  );
}
