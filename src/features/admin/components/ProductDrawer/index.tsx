import type { Product } from "@features/products";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
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
      onClose={(_event, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      elevation={0}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 560 },
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close drawer">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      {/* Form stretches to fill remaining height */}
      <ProductForm
        key={mode === "update" ? (editingProduct?.id ?? "update") : "add"}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
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
    </Drawer>
  );
}
