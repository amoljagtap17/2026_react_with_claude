import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { ProductFormValues } from "./ProductFormSchema";
import { PRODUCT_FORM_DEFAULTS, productFormSchema } from "./ProductFormSchema";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

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
