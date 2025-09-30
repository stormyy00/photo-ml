import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { SortDesc, SortAsc, ArrowRightLeft, Loader } from "lucide-react";
import { flexRender, Table as TableType } from "@tanstack/react-table";

interface LinkTableProps<TData> {
  table: TableType<TData>;
  loading: boolean;
  error: boolean;
}

const UITable = <TData,>({ table, loading, error }: LinkTableProps<TData>) => {
  return (
    <div className="relative w-full bg-white rounded-lg border border-photo-green-200 shadow-sm overflow-visible">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-3 text-photo-green-400">
            <Loader size={20} className="animate-spin" />
            <span className="font-medium">Loading users…</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-3 text-red-400">
            <span className="font-medium">Error loading data.</span>
          </div>
        </div>
      )}
      <Table className="border-collapse w-full">
        <TableHeader className=" bg-photo-green-50/80 backdrop-blur rounded-t-2xl shadow">
          {table.getHeaderGroups().map(({ id, headers }) => (
            <TableRow key={id} className="w-full">
              {headers.map(({ id, column, getContext, getSize }) => (
                <TableHead
                  key={id}
                  style={{ width: getSize() }}
                  className="py-1 px-8 text-base font-semibold text-photo-green-600 bg-transparent first:rounded-tl-2xl last:rounded-tr-2xl"
                >
                  <div className="flex items-center gap-1 justify-center w-1/2 mx-auto">
                    {flexRender(column.columnDef.header, getContext())}
                    {column.getCanSort() && (
                      <button
                        onClick={column.getToggleSortingHandler()}
                        className="ml-1 text-photo-green-400 hover:text-photo-green-500 transition"
                        aria-label="Toggle sort"
                      >
                        {column.getIsSorted() === "asc" && (
                          <SortAsc size={18} />
                        )}
                        {column.getIsSorted() === "desc" && (
                          <SortDesc size={18} />
                        )}
                        {!column.getIsSorted() && (
                          <ArrowRightLeft size={18} className="opacity-60" />
                        )}
                      </button>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map(({ id, original, getIsSelected, getVisibleCells }) => {
                const isSelected = getIsSelected();
                console.log({ original, isSelected });

                return (
                  <TableRow
                    key={id}
                    className={`border-b border-gray-100 hover:bg-photo-green-50 transition-colors cursor-pointer`}
                  >
                    {getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-900  text-center"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-gray-500"
              >
                No Data found.
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            table.getRowModel().rows?.length > 0 &&
            (() => {
              const pageSize = 10;
              const rows = table.getRowModel().rows.length;
              const fillers = Math.max(0, pageSize - rows);
              const cols = table.getVisibleLeafColumns();
              return Array.from({ length: fillers }).map((_, i) => (
                <TableRow
                  key={`filler-${i}`}
                  className="border-b border-gray-100"
                >
                  {cols.map((col) => (
                    <TableCell key={`f-${i}-${col.id}`} className="px-6 py-4">
                      <span className="opacity-0">&nbsp;</span>
                    </TableCell>
                  ))}
                </TableRow>
              ));
            })()}
        </TableBody>
      </Table>
      <div className="flex w-full items-center justify-end rounded-b bg-white p-4 text-lg border-t border-photo-green-100">
        {loading && (
          <Loader size={20} className="animate-spin text-photo-green-400" />
        )}
        <div className="mx-2">{table.getRowModel().rows.length} row(s)</div>
      </div>
    </div>
  );
};

export default UITable;
