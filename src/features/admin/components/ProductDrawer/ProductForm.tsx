import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { ProductFormValues } from "./ProductFormSchema";
import { PRODUCT_FORM_DEFAULTS, productFormSchema } from "./ProductFormSchema";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  children: ReactNode;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  children,
}: ProductFormProps) {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { ...PRODUCT_FORM_DEFAULTS, ...defaultValues },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
