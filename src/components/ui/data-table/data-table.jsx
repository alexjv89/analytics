"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export function DataTable({
  columns,
  data,
  className,
  toolbar,
  ...props
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...props,
  })

  return (
    <div className="space-y-2">
      {toolbar && toolbar(table)}
      <div className={cn("w-full border rounded-md overflow-hidden", className)}>
        <div className="overflow-auto h-full">
          <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead 
                    key={header.id}
                    style={{ 
                      ...(header.column.getIsPinned() ? {
                        left: `${header.column.getStart('left')}px`,
                        right: `${header.column.getAfter('right')}px`,
                        position: 'sticky',
                        zIndex: 10,
                      } : {})
                    }}
                    className={cn(
                      header.column.columnDef.meta?.headerClassName,
                      header.column.getIsPinned() === 'left' && "bg-background"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute -right-1 top-0 h-full w-3 cursor-col-resize select-none touch-none opacity-0 hover:opacity-100 z-30",
                          header.column.getIsResizing() && "opacity-100"
                        )}
                        style={{
                          background: header.column.getIsResizing() ? 'var(--primary)' : 'transparent',
                          borderLeft: '1px solid var(--border)',
                          borderRight: '1px solid var(--border)'
                        }}
                      />
                    )}
                  </TableHead>
                )
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
                    style={{
                      ...(cell.column.getIsPinned() ? {
                        left: `${cell.column.getStart('left')}px`,
                        right: `${cell.column.getAfter('right')}px`,
                        position: 'sticky',
                        zIndex: 5,
                      } : {})
                    }}
                    className={cn(
                      cell.column.columnDef.meta?.cellClassName,
                      cell.column.getIsPinned() === 'left' && "bg-background"
                    )}
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
      </div>
    </div>
  )
}