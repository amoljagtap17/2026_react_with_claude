import type { CreateProductInput } from "@features/products";
import { createProductSchema } from "@features/products";

export const productFormSchema = createProductSchema;

export type ProductFormValues = CreateProductInput;

export const PRODUCT_FORM_DEFAULTS: ProductFormValues = {
  name: "",
  category: "Electronics",
  price: 0,
  stock: 0,
  description: "",
  condition: "new",
  isFeatured: false,
};
