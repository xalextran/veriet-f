"use client";

import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  ArrowUpDown, 
  Download,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image,
  FileSpreadsheet,
  Loader2
} from "lucide-react";
import { useFiles, type FileData } from "@/hooks/use-files";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

// File format color mapping (Big 4 strategy)
const getFileFormatColor = (format: string) => {
  switch (format.toUpperCase()) {
    case 'PDF': return 'red';
    case 'DOC':
    case 'DOCX': return 'blue';
    case 'JPG':
    case 'JPEG':
    case 'PNG':
    case 'GIF': return 'green';
    case 'XLS':
    case 'XLSX': return 'green';
    default: return 'grey';
  }
};

// File format icon mapping
const getFileFormatIcon = (format: string) => {
  switch (format.toUpperCase()) {
    case 'PDF':
    case 'DOC':
    case 'DOCX': return FileText;
    case 'JPG':
    case 'JPEG':
    case 'PNG':
    case 'GIF': return Image;
    case 'XLS':
    case 'XLSX': return FileSpreadsheet;
    default: return FileText;
  }
};

export function LibraryTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  // Debounce search input to avoid excessive API calls
  const debouncedSearch = useDebounce(globalFilter, 300);

  // Reset page when search or sorting changes
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch, sorting]);

  // Fetch data with React Query
  const { 
    data: filesResponse, 
    isLoading, 
    error,
    isError 
  } = useFiles({
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch || undefined, // Use debounced value for API
    sortBy: sorting[0]?.id || "uploadDate", // Use the column ID directly
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const data = filesResponse?.data || [];
  const pagination = filesResponse?.pagination;

  // Show search loading when there's a difference between input and debounced value
  const isSearching = globalFilter !== debouncedSearch && globalFilter.length > 0;

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: pageSize }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );

  // Define table columns
  const columns: ColumnDef<FileData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 24,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div className="flex items-center justify-between">
            <span className="font-medium">Name</span>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto w-auto p-1"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{file.name}</span>
            <StatusBadge
              label={file.fileFormat}
              color={getFileFormatColor(file.fileFormat)}
              icon={getFileFormatIcon(file.fileFormat)}
              className="text-xs w-auto"
            />
          </div>
        );
      },
      size: 300,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        return <span className="text-muted-foreground">{row.getValue("type")}</span>;
      },
      size: 120,
    },
    {
      accessorKey: "size",
      header: ({ column }) => {
        return (
          <div className="flex items-center justify-between">
            <span className="font-medium">Size</span>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto w-auto p-1"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return <span className="text-muted-foreground">{row.getValue("size")}</span>;
      },
      size: 100,
    },
    {
      accessorKey: "folder",
      header: "Folder",
      cell: ({ row }) => {
        return <span className="text-muted-foreground text-sm">{row.getValue("folder")}</span>;
      },
      size: 250,
    },
    {
      accessorKey: "uploadDate",
      header: ({ column }) => {
        return (
          <div className="flex items-center justify-between">
            <span className="font-medium">Upload date</span>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto w-auto p-1"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("uploadDate"));
        return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>;
      },
      size: 130,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const file = row.original;
        
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("View details:", file.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("Download:", file.id)}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("More actions:", file.id)}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      size: 120,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    manualPagination: true, // We handle pagination server-side
    manualFiltering: true, // We handle search server-side
    manualSorting: true, // We handle sorting server-side
    pageCount: pagination?.totalPages || 0,
    columnResizeMode: 'onChange',
    enableColumnResizing: false,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-500">
            <p>Failed to load files. Please try again.</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error?.message || "An unknown error occurred"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            )}
            <Input
              placeholder="Search files and folders..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className={`pl-10 ${isSearching ? 'pr-10' : ''}`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead 
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="min-w-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className="min-w-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {pagination?.total || 0} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
              disabled={pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {pageIndex + 1} of {pagination?.totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(pageIndex + 1)}
              disabled={pageIndex >= (pagination?.totalPages || 1) - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
