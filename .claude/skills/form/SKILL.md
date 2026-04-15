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

Read `reference.md` (in this skill folder) for the full API of `FormInput`, `FormSelect`, and `FormCheckbox`, and the field-to-component mapping table.

### 4. Check for an existing Zod schema

Look for a file at `src/features/<feature>/schemas/<entity>.schema.ts`.

- If a `create<Entity>Schema` exists → re-export and alias it in `<Name>FormSchema.ts` rather than duplicating
- If none exists → define a new `z.object({...})` schema from scratch

### 5. Create `<Name>FormSchema.ts`

```ts
// If reusing an existing schema:
import { create<Entity>Schema } from "@features/<feature>";
import type { Create<Entity>Input } from "@features/<feature>";

export const <name>FormSchema = create<Entity>Schema;
export type <Name>FormValues = Create<Entity>Input;

// If defining from scratch:
import { z } from "zod";

export const <name>FormSchema = z.object({
  // use z.string().min(1, "Required") for required text
  // use z.coerce.number().positive() for price-like numbers
  // use z.coerce.number().int().nonnegative() for count-like numbers
  // use z.enum(CONST, { error: "..." }) for string unions
  // use z.boolean() for checkboxes
  // use z.string().optional() for optional text
});
export type <Name>FormValues = z.infer<typeof <name>FormSchema>;

// Defaults — every key must have a value (no undefined)
export const <NAME>_FORM_DEFAULTS: <Name>FormValues = {
  // string: ""
  // number: 0
  // boolean: false
  // enum: first value of the const array
  // optional string: ""
};
```

### 6. Create `<Name>FormFields.tsx`

Consult `reference.md` for the field → component mapping.

```tsx
import { FormCheckbox, FormInput, FormSelect } from "@components/form";
// import enum const arrays from the feature schema if needed
import Box from "@mui/material/Box";

export function <Name>FormFields() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* one component per schema field */}
    </Box>
  );
}
```

### 7. Create `<Name>Form.tsx`

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

### 8. Create `<Name>ActionButtons.tsx`

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

### 9. Create `index.ts`

```ts
export { <Name>Form } from "./<Name>Form";
export type { <Name>FormValues } from "./<Name>FormSchema";
```

### 10. Verify

Run `npx tsc --noEmit`. Fix any type errors before finishing.
