# Form Skill — Canonical Examples

## The Reference Implementation: ProductForm

The `ProductDrawer` contains the complete working reference for this pattern. Read these files before generating any new form:

```
src/features/admin/components/ProductDrawer/ProductFormSchema.ts
src/features/admin/components/ProductDrawer/ProductForm.tsx
src/features/admin/components/ProductDrawer/ProductFormFields.tsx
src/features/admin/components/ProductDrawer/ProductActionButtons.tsx
```

And the reusable components being used:

```
src/components/form/FormInput/index.tsx
src/components/form/FormSelect/index.tsx
src/components/form/FormCheckbox/index.tsx
```

---

## Key Patterns to Notice

### `ProductFormSchema.ts` — reusing an existing schema

```ts
import type { CreateProductInput } from "@features/products";
import { createProductSchema } from "@features/products";

// Re-export rather than duplicating the schema
export const productFormSchema = createProductSchema;
export type ProductFormValues = CreateProductInput;

export const PRODUCT_FORM_DEFAULTS: ProductFormValues = {
  name: "",
  category: "Electronics", // first value of the enum
  price: 0,
  stock: 0,
  description: "",
  condition: "new",
  isFeatured: false,
};
```

### `ProductFormFields.tsx` — declarative field layout

```tsx
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
```

### `ProductForm.tsx` — `<Box component="form">` with `sx` prop

```tsx
export function ProductForm({
  defaultValues,
  onSubmit,
  children,
  sx,
}: ProductFormProps) {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { ...PRODUCT_FORM_DEFAULTS, ...defaultValues },
  });

  return (
    <FormProvider {...methods}>
      {/* Box component="form" (not <form>) enables the sx layout prop */}
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        sx={sx}
      >
        {children}
      </Box>
    </FormProvider>
  );
}
```

### `ProductActionButtons.tsx` — reads formState from context

```tsx
export function ProductActionButtons({
  onCancel,
  isPending = false,
}: ProductActionButtonsProps) {
  const { formState } = useFormContext();
  const isDisabled = formState.isSubmitting || isPending;

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
      <Button variant="outlined" onClick={onCancel} disabled={isDisabled}>
        Cancel
      </Button>
      <Button type="submit" variant="contained" disabled={isDisabled}>
        {isPending ? "Saving…" : "Save"}
      </Button>
    </Stack>
  );
}
```

### `index.ts` — barrel exports only what callers need

```ts
export { ProductForm } from "./ProductForm";
export type { ProductFormValues } from "./ProductFormSchema";
```

---

## How the Form Is Used in a Drawer

The caller controls layout via the `sx` prop:

```tsx
// In ProductDrawer/index.tsx
<ProductForm
  key={mode === "update" ? (editingProduct?.id ?? "update") : "add"}
  defaultValues={defaultValues}
  onSubmit={handleSubmit}
  sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
>
  {/* Scrollable body */}
  <Box sx={{ flex: 1, overflow: "auto", px: 3, py: 3 }}>
    <ProductFormFields />
  </Box>

  {/* Sticky footer */}
  <Divider />
  <Box sx={{ px: 3, py: 2, flexShrink: 0 }}>
    <ProductActionButtons onCancel={onClose} isPending={isPending} />
  </Box>
</ProductForm>
```

Note: `key` prop forces the form to remount when switching between add/update or between different records, ensuring `defaultValues` are applied fresh each time.
