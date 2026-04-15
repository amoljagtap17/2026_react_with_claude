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
```

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
