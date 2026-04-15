import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_CONDITIONS = ["new", "used", "refurbished"] as const;

export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];

export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  category: z.enum(PRODUCT_CATEGORIES, {
    error: "Please select a valid category",
  }),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  description: z.string().optional(),
  condition: z.enum(PRODUCT_CONDITIONS, {
    error: "Please select a product condition",
  }),
  isFeatured: z.boolean(),
  createdAt: z.iso.datetime(),
});

export type Product = z.infer<typeof productSchema>;

export const createProductSchema = productSchema
  .omit({ id: true, createdAt: true })
  .extend({
    price: z.coerce
      .number({ error: "Price is required" })
      .positive("Price must be a positive number"),
    stock: z.coerce
      .number({ error: "Stock is required" })
      .int()
      .nonnegative("Stock cannot be negative"),
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
