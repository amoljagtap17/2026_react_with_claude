# Form Components Reference

All components live in `src/components/form/` and are exported from `@components/form`.

**Critical rule:** All three components call `useFormContext()` internally — they must always be rendered inside a `<FormProvider>`. No `control` prop drilling needed.

---

## `FormInput`

Wraps MUI `TextField`. Automatically shows `fieldState.error?.message` as `helperText`.

```tsx
import { FormInput } from "@components/form";

// Basic text field
<FormInput name="name" label="Name" required />

// Optional multiline text
<FormInput name="description" label="Description" multiline rows={3} />

// Number field
<FormInput
  name="price"
  label="Price ($)"
  type="number"
  required
  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
/>

// Integer field
<FormInput
  name="stock"
  label="Stock"
  type="number"
  required
  slotProps={{ htmlInput: { min: 0, step: 1 } }}
/>
```

**Props:**

| Prop         | Type                 | Notes                                                      |
| ------------ | -------------------- | ---------------------------------------------------------- |
| `name`       | `string`             | **Required.** Field name matching the schema key           |
| `label`      | `string`             | Input label                                                |
| `type`       | `string`             | `"text"` (default) or `"number"`                           |
| `required`   | `boolean`            | Shows `*` indicator                                        |
| `multiline`  | `boolean`            | Renders as `<textarea>`                                    |
| `rows`       | `number`             | Number of textarea rows                                    |
| `slotProps`  | `TextFieldSlotProps` | Use `{ htmlInput: { min, step } }` for number inputs       |
| `helperText` | `string`             | Shown when no error; a single space `" "` preserves height |
| `...rest`    | `TextFieldProps`     | Any other MUI TextField prop                               |

---

## `FormSelect`

Wraps MUI `Select` + `FormControl` + `InputLabel` + `FormHelperText`.

```tsx
import { FormSelect } from "@components/form";
import { PRODUCT_CATEGORIES } from "@features/products/schemas/product.schema";

<FormSelect
  name="category"
  label="Category"
  options={PRODUCT_CATEGORIES}
  required
/>;
```

**Props:**

| Prop       | Type                    | Notes                                                        |
| ---------- | ----------------------- | ------------------------------------------------------------ |
| `name`     | `string`                | **Required.**                                                |
| `label`    | `string`                | **Required.** Shown in InputLabel and Select label           |
| `options`  | `ReadonlyArray<string>` | **Required.** Pass a `readonly string[]` or `as const` array |
| `required` | `boolean`               | Adds `*` to label                                            |
| `disabled` | `boolean`               | Disables the select                                          |

The value and label for each option are the same string. If you need separate value/label pairs, use `FormInput` with a custom Select instead.

---

## `FormCheckbox`

Wraps MUI `Checkbox` + `FormControlLabel`. Handles boolean coercion internally.

```tsx
import { FormCheckbox } from "@components/form";

<FormCheckbox name="isFeatured" label="Featured product" />;
```

**Props:**

| Prop       | Type      | Notes                                    |
| ---------- | --------- | ---------------------------------------- |
| `name`     | `string`  | **Required.**                            |
| `label`    | `string`  | **Required.** Shown next to the checkbox |
| `disabled` | `boolean` | Disables the checkbox                    |

---

## Field → Component Mapping

| Zod schema type                         | Component to use                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| `z.string().min(1, "…")`                | `<FormInput name label required />`                                             |
| `z.string().optional()`                 | `<FormInput name label />` or with `multiline rows`                             |
| `z.string().email("…")`                 | `<FormInput name label required />`                                             |
| `z.enum(CONST)`                         | `<FormSelect name label options={CONST} required />`                            |
| `z.boolean()`                           | `<FormCheckbox name label />`                                                   |
| `z.coerce.number().positive()`          | `<FormInput type="number" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />` |
| `z.coerce.number().int().nonnegative()` | `<FormInput type="number" slotProps={{ htmlInput: { min: 0, step: 1 } }} />`    |

---

## Schema Conventions

```ts
// Number inputs from HTML always arrive as strings — use z.coerce.number()
price: z.coerce.number({ error: "Price is required" }).positive("Must be positive"),
stock: z.coerce.number({ error: "Stock is required" }).int().nonnegative("Cannot be negative"),

// String unions — reference a const array so FormSelect can use it too
export const STATUSES = ["active", "inactive", "pending"] as const;
status: z.enum(STATUSES, { error: "Please select a status" }),

// Error messages go in the schema, not in the component
name: z.string().min(1, "Name is required"),

// Email
email: z.string().email("Must be a valid email address"),

// Optional with constraints
bio: z.string().max(500, "Cannot exceed 500 characters").optional(),
```

**Validation chaining for custom rules:**

| Rule         | Zod chain                      | Example                                                   |
| ------------ | ------------------------------ | --------------------------------------------------------- |
| Min length   | `.min(n, "message")`           | `z.string().min(2, "At least 2 characters")`              |
| Max length   | `.max(n, "message")`           | `z.string().max(100, "Cannot exceed 100 chars")`          |
| Pattern      | `.regex(/pattern/, "message")` | `z.string().regex(/^[A-Z]/, "Must start with uppercase")` |
| Email        | `.email("message")`            | `z.string().email("Invalid email")`                       |
| Min (number) | `.min(n, "message")`           | `z.coerce.number().min(0, "Must be at least 0")`          |
| Max (number) | `.max(n, "message")`           | `z.coerce.number().max(1000, "Cannot exceed 1000")`       |
| Positive     | `.positive("message")`         | `z.coerce.number().positive("Must be positive")`          |
| Integer      | `.int("message")`              | `z.coerce.number().int("Must be a whole number")`         |

---

## Layout Patterns

### Default: Single column

Wrap all fields in a `<Box>` flex column with `gap: 2`:

```tsx
<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
  <FormInput name="name" label="Name" required />
  <FormInput name="email" label="Email" required />
</Box>
```

### Multi-column with sections

Use MUI `Grid2` inside named sections. Each section gets a title + divider:

```tsx
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
  {/* Section with 2-column grid */}
  <Box>
    <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
      Customer Information
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput name="firstName" label="First Name" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput name="lastName" label="Last Name" required />
      </Grid>
      {/* Full-width field within a 2-col section */}
      <Grid size={{ xs: 12 }}>
        <FormInput name="email" label="Email" required />
      </Grid>
    </Grid>
  </Box>

  {/* Single-column section — no Grid needed */}
  <Box>
    <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
      Notes
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <FormInput name="notes" label="Notes" multiline rows={3} />
  </Box>
</Box>;
```

**Column assignment rules:**

- `columns: 1` → each field is `<Grid size={{ xs: 12 }}>` (or no Grid at all)
- `columns: 2` → each field is `<Grid size={{ xs: 12, sm: 6 }}>` by default; a field that would be alone on its row gets `<Grid size={{ xs: 12 }}>` to avoid a half-empty row

---

## Conditional Fields

Use `useWatch` at the top of `<Name>FormFields` to read a trigger field's value, then conditionally render the dependent field.

```tsx
import { useWatch } from "react-hook-form";

export function OrderFormFields() {
  const deliveryType = useWatch({ name: "deliveryType" });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormSelect
        name="deliveryType"
        label="Delivery Type"
        options={DELIVERY_TYPE_OPTIONS}
        required
      />

      {/* Only shown when deliveryType !== "pickup" */}
      {deliveryType !== "pickup" && (
        <FormInput name="deliveryDate" label="Delivery Date" required />
      )}
    </Box>
  );
}
```

**Operator → JS expression mapping:**

| Operator | Expression                         |
| -------- | ---------------------------------- |
| `eq`     | `watchedValue === condition.value` |
| `notEq`  | `watchedValue !== condition.value` |
| `gt`     | `watchedValue > condition.value`   |
| `gte`    | `watchedValue >= condition.value`  |
| `lt`     | `watchedValue < condition.value`   |
| `lte`    | `watchedValue <= condition.value`  |

**Multiple conditions on different fields:** add a separate `useWatch` call per trigger field.

**Important:** When a conditional field is hidden, its value remains in the form state. The schema should mark it optional or the caller should strip hidden fields before submitting if needed.

---

## `<Name>Form.tsx` Layout Notes

The `sx` prop on `<Box component="form">` is used by callers to control layout:

```tsx
// Inside a Drawer (flex column, scrollable body)
<MyForm
  sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
  onSubmit={handleSubmit}
>
  <Box sx={{ flex: 1, overflow: "auto", px: 3, py: 3 }}>
    <MyFormFields />
  </Box>
  <Divider />
  <Box sx={{ px: 3, py: 2 }}>
    <MyActionButtons onCancel={onClose} isPending={isPending} />
  </Box>
</MyForm>

// Inside a Page (simple)
<MyForm onSubmit={handleSubmit}>
  <MyFormFields />
  <MyActionButtons onCancel={handleCancel} />
</MyForm>
```
