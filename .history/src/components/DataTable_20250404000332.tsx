
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: ({ row }: { row: { original: T } }) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  pagination?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  searchKey,
  onRowClick,
  loading = false,
  pagination = true,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const itemsPerPage = 10;

  // Filter data based on search query
  const filteredData = searchKey
    ? data.filter((item) => {
        const value = item[searchKey] as any;
        return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
      })
    : data;

  // Sort data
  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T] as any;
        const bValue = b[sortConfig.key as keyof T] as any;
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = pagination
    ? sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : sortedData;

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-40 h-10 bg-muted/50 animate-pulse rounded" />
          <div className="w-60 h-10 bg-muted/50 animate-pulse rounded" />
        </div>
        <div className="border rounded-md">
          <div className="h-12 border-b px-4 bg-muted/20" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 border-b px-4 animate-pulse bg-muted/10"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {searchKey && (
        <div className="flex items-center mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header.toString()} className="font-semibold">
                  {column.sortable ? (
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort(column.accessorKey)}
                    >
                      {column.header}
                      {sortConfig.key === column.accessorKey && (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey.toString()}>
                      {column.cell
                        ? column.cell({ row: { original: item } })
                        : (item[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pageCount > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}


