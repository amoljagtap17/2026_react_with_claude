import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import type { IHeaderParams } from "ag-grid-community";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { ColumnMenu } from "./ColumnMenu";

export function CustomHeader({
  displayName,
  column,
  enableSorting,
  api,
}: IHeaderParams) {
  const [sort, setSort] = useState<"asc" | "desc" | null>(
    (column.getSort() as "asc" | "desc" | null | undefined) ?? null
  );
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  // Keep local sort indicator in sync with grid state
  useEffect(() => {
    const syncSort = () => {
      setSort((column.getSort() as "asc" | "desc" | null | undefined) ?? null);
    };
    column.addEventListener("sortChanged", syncSort);
    return () => column.removeEventListener("sortChanged", syncSort);
  }, [column]);

  // Cycle: null → asc → desc → null
  const handleSortClick = useCallback(() => {
    if (!enableSorting) return;
    const next: "asc" | "desc" | null =
      sort == null ? "asc" : sort === "asc" ? "desc" : null;
    api.applyColumnState({
      state: [{ colId: column.getColId(), sort: next }],
      defaultState: { sort: null },
    });
  }, [enableSorting, sort, api, column]);

  const handleMenuOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        gap: 0.25,
        px: 0.5,
      }}
    >
      {/* Column label — click to cycle sort */}
      <Box
        component="span"
        onClick={handleSortClick}
        sx={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          cursor: enableSorting ? "pointer" : "default",
          userSelect: "none",
          fontSize: "inherit",
          fontWeight: "inherit",
          lineHeight: "inherit",
        }}
        title={displayName}
      >
        {displayName}
      </Box>

      {/* Sort direction indicator */}
      {sort === "asc" && (
        <ArrowUpwardIcon
          sx={{ fontSize: 13, color: "primary.main", flexShrink: 0 }}
        />
      )}
      {sort === "desc" && (
        <ArrowDownwardIcon
          sx={{ fontSize: 13, color: "primary.main", flexShrink: 0 }}
        />
      )}

      {/* Column menu trigger */}
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{ p: 0.25, flexShrink: 0 }}
        aria-label="Column settings"
      >
        <MoreVertIcon sx={{ fontSize: 15 }} />
      </IconButton>

      <ColumnMenu
        gridApi={api}
        anchorEl={menuAnchor}
        colId={column.getColId()}
        currentSort={sort}
        onClose={() => setMenuAnchor(null)}
      />
    </Box>
  );
}
