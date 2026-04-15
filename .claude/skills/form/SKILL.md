# Form Skill

Scaffolds the 4 form files + `index.ts` barrel for a new form component following the project's established React Hook Form + Zod + MUI pattern.

**NOT in scope:** Drawer/page container, API mutations, route wiring. Those are done separately.

---

## Arguments

`<FormName> for <feature> [with fields: <field descriptions>]`

Examples:

- `ProductFilter for dashboard with fields: name (string), minPrice (number), category (enum), inStockOnly (boolean)`
- `CreateOrder for orders`

---

## Output

Creates 5 files inside `src/features/<feature>/components/<Name>Form/`:

```
<Name>Form/
├── index.ts                ← barrel: exports <Name>Form + type <Name>FormValues
├── <Name>FormSchema.ts     ← Zod schema + <Name>FormValues type + <NAME>_FORM_DEFAULTS
├── <Name>Form.tsx          ← useForm + zodResolver + FormProvider + <Box component="form" sx>
├── <Name>FormFields.tsx    ← declarative fields: FormInput / FormSelect / FormCheckbox
└── <Name>ActionButtons.tsx ← Cancel + Save buttons reading formState from context
```

---

## Steps

### 1. Parse arguments

Extract from the arguments string:

- **`<Name>`** — PascalCase form name (e.g. `ProductFilter`, `CreateOrder`)
- **`<feature>`** — target feature folder under `src/features/` (e.g. `dashboard`, `orders`)
- **Field hints** — list of field names and types if provided

### 2. Read canonical examples

Read `examples.md` (in this skill folder) for the complete ProductDrawer reference implementation and patterns to replicate.

### 3. Read component API

Read `reference.md` (in this skill folder) for the full API of `FormInput`, `FormSelect`, and `FormCheckbox`, and the field-to-component mapping table. Also read the layout, conditional, and validation sections.

### 4. Create `<Name>FormSchema.ts`

Always define the Zod schema from scratch — do not look for or reuse an existing schema.

```ts
import { z } from "zod";

export const <name>FormSchema = z.object({
  // use z.string().min(1, "Required") for required text
  // use z.string().optional() for optional text / textarea
  // use z.string().email("Must be a valid email") for email fields
  // use z.coerce.number().positive() for price-like numbers
  // use z.coerce.number().int().nonnegative() for count-like integers
  // use z.enum(CONST, { error: "..." }) for string unions
  // use z.boolean() for checkboxes
});
export type <Name>FormValues = z.infer<typeof <name>FormSchema>;

// Defaults — every key must have a value (no undefined)
export const <NAME>_FORM_DEFAULTS: <Name>FormValues = {
  // string / textarea / email: ""
  // number / integer: 0
  // boolean: false
  // enum: first value of the const array
};
```

**For enum fields:** define the const array at the top of the schema file and export it:

```ts
export const CATEGORY_OPTIONS = [
  "Electronics",
  "Clothing",
  "Home & Garden",
] as const;
```

**Validation chaining** — apply these Zod refinements when the field definition specifies them:

| Rule           | Zod chain                      |
| -------------- | ------------------------------ |
| `minLength: n` | `.min(n, "message")`           |
| `maxLength: n` | `.max(n, "message")`           |
| `pattern`      | `.regex(/pattern/, "message")` |
| `min: n`       | `.min(n, "message")` (numbers) |
| `max: n`       | `.max(n, "message")` (numbers) |
| email          | `z.string().email("message")`  |

### 5. Create `<Name>FormFields.tsx`

Consult `reference.md` for the field → component mapping.

**Default layout (no sections):**

```tsx
import { FormCheckbox, FormInput, FormSelect } from "@components/form";
import Box from "@mui/material/Box";

export function <Name>FormFields() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* one component per schema field */}
    </Box>
  );
}
```

**Multi-column layout with sections** — use MUI `Grid2` when a section has `columns: 2`:

```tsx
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// Inside the return:
<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
  <Box>
    <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
      Section Title
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput name="firstName" label="First Name" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput name="lastName" label="Last Name" required />
      </Grid>
      {/* A field that spans the full width in a 2-col section: size={{ xs: 12 }} */}
    </Grid>
  </Box>
</Box>;
```

**Conditional fields** — use `useWatch` at the top of `<Name>FormFields` for any field with a display condition:

```tsx
import { useWatch } from "react-hook-form";

export function <Name>FormFields() {
  // One useWatch call per conditional trigger field
  const deliveryType = useWatch({ name: "deliveryType" });

  return (
    // ...
    {deliveryType !== "pickup" && (
      <FormInput name="deliveryDate" label="Delivery Date" required />
    )}
  );
}
```

Supported operators: `eq` (===), `notEq` (!==), `gt` (>), `gte` (>=), `lt` (<), `lte` (<=).

### 6. Create `<Name>Form.tsx`

Use `<Box component="form">` (not `<form>`) — this enables the MUI `sx` prop, which callers use to make the form a flex-column inside a Drawer or Page.

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { <Name>FormValues } from "./<Name>FormSchema";
import { <NAME>_FORM_DEFAULTS, <name>FormSchema } from "./<Name>FormSchema";

interface <Name>FormProps {
  defaultValues?: Partial<<Name>FormValues>;
  onSubmit: (values: <Name>FormValues) => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export function <Name>Form({ defaultValues, onSubmit, children, sx }: <Name>FormProps) {
  const methods = useForm<<Name>FormValues>({
    resolver: zodResolver(<name>FormSchema),
    defaultValues: { ...<NAME>_FORM_DEFAULTS, ...defaultValues },
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate sx={sx}>
        {children}
      </Box>
    </FormProvider>
  );
}
```

### 7. Create `<Name>ActionButtons.tsx`

```tsx
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useFormContext } from "react-hook-form";

interface <Name>ActionButtonsProps {
  onCancel: () => void;
  isPending?: boolean;
}

export function <Name>ActionButtons({ onCancel, isPending = false }: <Name>ActionButtonsProps) {
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

### 8. Create `index.ts`

```ts
export { <Name>Form } from "./<Name>Form";
export type { <Name>FormValues } from "./<Name>FormSchema";
```

### 9. Verify

Run `npx tsc --noEmit`. Fix any type errors before finishing.
