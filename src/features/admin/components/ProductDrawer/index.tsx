import type { Product } from "@features/products";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { useCreateProduct } from "../../api/useCreateProduct";
import { useUpdateProduct } from "../../api/useUpdateProduct";
import { ProductActionButtons } from "./ProductActionButtons";
import { ProductForm } from "./ProductForm";
import { ProductFormFields } from "./ProductFormFields";
import type { ProductFormValues } from "./ProductFormSchema";

export interface ProductDrawerProps {
  open: boolean;
  mode: "add" | "update";
  editingProduct?: Product;
  onClose: () => void;
}

export function ProductDrawer({
  open,
  mode,
  editingProduct,
  onClose,
}: ProductDrawerProps) {
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const isPending = isCreating || isUpdating;
  const title = mode === "add" ? "Add Product" : "Update Product";

  const defaultValues: Partial<ProductFormValues> | undefined =
    mode === "update" && editingProduct
      ? {
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price,
          stock: editingProduct.stock,
          condition: editingProduct.condition,
          isFeatured: editingProduct.isFeatured,
          description: editingProduct.description ?? "",
        }
      : undefined;

  const handleSubmit = (values: ProductFormValues) => {
    if (mode === "add") {
      createProduct(values, { onSuccess: onClose });
    } else if (editingProduct) {
      updateProduct(
        { id: editingProduct.id, input: values },
        { onSuccess: onClose }
      );
    }
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 420 } } }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Divider />

      {/* Form — key forces remount when switching product or mode */}
      <Box sx={{ px: 3, py: 3, flex: 1, overflow: "auto" }}>
        <ProductForm
          key={mode === "update" ? (editingProduct?.id ?? "update") : "add"}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        >
          <ProductFormFields />
          <ProductActionButtons onCancel={onClose} isPending={isPending} />
        </ProductForm>
      </Box>
    </Drawer>
  );
}
