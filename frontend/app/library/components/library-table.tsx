"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
  FileSpreadsheet
} from "lucide-react";

// Define the file data structure
export type FileData = {
  id: string;
  name: string;
  type: string; // Business type: Invoice, Contract, etc.
  fileFormat: string; // File format: PDF, DOCX, etc.
  size: string;
  folder: string;
  uploadDate: string;
};

// Generate realistic dummy data
const generateDummyData = (): FileData[] => {
  const businessTypes = ["Invoice", "Contract", "Receipt", "Report", "Proposal", "Agreement"];
  const fileFormats = ["PDF", "DOCX", "XLSX", "JPG", "PNG"];
  const folders = [
    "Financial Documents > Invoices",
    "Legal Documents > Contracts", 
    "Expenses > Receipts",
    "Reports > Monthly",
    "Projects > Proposals",
    "HR > Agreements",
    "Marketing > Assets",
    "Operations > Reports"
  ];
  
  const files: FileData[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    const fileFormat = fileFormats[Math.floor(Math.random() * fileFormats.length)];
    const folder = folders[Math.floor(Math.random() * folders.length)];
    
    // Generate realistic file sizes
    const sizeNum = Math.floor(Math.random() * 50000) + 100; // 100B to 50MB
    let size: string;
    if (sizeNum < 1024) {
      size = `${sizeNum} B`;
    } else if (sizeNum < 1024 * 1024) {
      size = `${(sizeNum / 1024).toFixed(1)} KB`;
    } else {
      size = `${(sizeNum / (1024 * 1024)).toFixed(1)} MB`;
    }
    
    // Generate dates within the last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const uploadDate = new Date();
    uploadDate.setDate(uploadDate.getDate() - daysAgo);
    
    files.push({
      id: `file_${i}`,
      name: `${businessType.toLowerCase()}_${i.toString().padStart(3, '0')}.${fileFormat.toLowerCase()}`,
      type: businessType,
      fileFormat,
      size,
      folder,
      uploadDate: uploadDate.toISOString().split('T')[0], // YYYY-MM-DD format
    });
  }
  
  return files;
};

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
  const [data] = useState<FileData[]>(generateDummyData());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

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
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableColumns = ['name', 'folder'];
      return searchableColumns.some(column => {
        const value = row.getValue(column) as string;
        return value?.toLowerCase().includes(filterValue.toLowerCase());
      });
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    columnResizeMode: 'onChange',
    enableColumnResizing: false,
  });

  return (
    <Card>
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10"
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
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
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
