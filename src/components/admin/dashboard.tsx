"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Toolbar from "./toolbar";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import UITable from "./table";
import { Loader } from "lucide-react";
// Note: This Dashboard is now reusable for any table data type.

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

type DashboardProps<TData> = {
  title?: string;
  columns: ColumnDef<TData, unknown>[];
  initialData?: TData[];
  queryKey: QueryKey;
  queryFn: () => Promise<TData[]>;
  searchKeys?: (keyof TData)[]; // keys to string-search
  filters?: { value: string; label: string }[];
  filterKey?: keyof TData; // field to match against filter value
  filterFn?: (row: TData, filterValue: string) => boolean; // custom predicate
};

const Dashboard = <TData,>({
  title,
  columns,
  initialData,
  queryKey,
  queryFn,
  searchKeys = [],
  filters = [],
  filterKey,
  filterFn,
}: DashboardProps<TData>) => {
  const [searchValue, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<RowSelectionState>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const { data, isPending, isError } = useQuery<TData[]>({
    queryKey,
    queryFn,
    initialData: initialData ?? [],
  });

  const debouncedSearch = useDebouncedValue(searchValue, 200);

  const filteredItems = useMemo(() => {
    if (!Array.isArray(data)) return data;
    if (!filter || filter === "all") return data;
    if (typeof filterFn === "function") {
      return data.filter((row) => filterFn(row, filter));
    }
    if (filterKey) {
      return data.filter((row) => String((row as any)?.[filterKey]) === filter);
    }
    return data;
  }, [data, filter, filterFn, filterKey]);

  const searchableItems = useMemo(() => {
    if (
      !debouncedSearch.trim() ||
      !Array.isArray(filteredItems) ||
      searchKeys.length === 0
    )
      return filteredItems;
    const queryLower = debouncedSearch.toLowerCase();
    return filteredItems.filter((row) => {
      return searchKeys.some((key) => {
        const value = row?.[key];
        return (
          typeof value === "string" && value.toLowerCase().includes(queryLower)
        );
      });
    });
  }, [debouncedSearch, filteredItems, searchKeys]);

  const table = useReactTable<TData>({
    data: Array.isArray(searchableItems) ? searchableItems : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getExpandedRowModel: getExpandedRowModel(),
    // getRowCanExpand: (_row) => true,
    onRowSelectionChange: setSelected,
    enableRowSelection: true,
    state: {
      rowSelection: selected,
    },
    // debugTable: true,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-1 flex items-center gap-3 w-full">
          <div className="text-xl font-bold text-photo-green-300 mb-1">
            {title}
          </div>

          <div className="mt-2 mb-1 bg-white/95 backdrop-blur-md border border-red-200/50 rounded-xl shadow-lg shadow-red-100/30 p-6">
            <Toolbar
              searchValue={searchValue}
              onSearchChange={(val) => setSearch(val)}
              filters={filters}
              selectedFilter={filter}
              onFilterChange={(val) => setFilter(val)}
            />
          </div>
        </div>
        <UITable table={table} loading={isPending} error={isError} />
      </div>
    </div>
  );
};

export default Dashboard;
