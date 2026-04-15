import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import MuiPagination from "@mui/material/Pagination";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

export interface AgGridPaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
}

export interface AgGridPaginationProps {
  paginationState: AgGridPaginationState;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function AgGridPagination({
  paginationState,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}: AgGridPaginationProps) {
  const { currentPage, totalPages, pageSize, totalRows } = paginationState;

  const firstRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastRow = Math.min(currentPage * pageSize, totalRows);

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    onPageSizeChange(Number(event.target.value));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1,
        borderTop: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      {/* Rows per page */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          Rows per page:
        </Typography>
        <Select<number>
          value={pageSize}
          onChange={handlePageSizeChange}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.875rem", minWidth: 72 }}
        >
          {pageSizeOptions.map(size => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Row count summary */}
      <Typography variant="body2" color="text.secondary" noWrap>
        {totalRows === 0
          ? "No rows"
          : `${firstRow.toLocaleString()}–${lastRow.toLocaleString()} of ${totalRows.toLocaleString()}`}
      </Typography>

      {/* Page navigation */}
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        shape="rounded"
        size="small"
        showFirstButton
        showLastButton
        disabled={totalRows === 0}
      />
    </Box>
  );
}
