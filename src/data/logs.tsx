"use client";

import { generateStatus } from "./columns";

import { ColumnDef } from "@tanstack/react-table";
import { LOG_TAGS } from "./tags";

export type Log = {
  ts: string;
  service: string;
  level: string;
  message: string;
  //   trace_id: string;
  //   user_id: string;
  //   method: string;
  //   path: string;
  duration_ms?: number;
};

export const COLUMNS: ColumnDef<Log, unknown>[] = [
  {
    accessorKey: "ts",
    header: "Timestamp",

    enableColumnFilter: true,
    filterFn: "includesString",
    // searchable: true,
    cell: ({ row }) => new Date(row.getValue("ts")).toLocaleString(),
  },
  {
    accessorKey: "service",
    header: "Service",
    enableColumnFilter: true,
    filterFn: "includesString",
    // searchable: true,
    cell: ({ row }) => (
      <div
        onClick={(e) => {
          row.getToggleSelectedHandler()(e);
          row.getToggleExpandedHandler()();
        }}
        className="hover:cursor-pointer"
      >
        {row.getValue("service")}
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "message",

    enableColumnFilter: true,
    filterFn: "includesString",
    // searchable: true,
    cell: ({ row }) => (
      <div
        onClick={(e) => {
          row.getToggleSelectedHandler()(e);
          row.getToggleExpandedHandler()();
        }}
        className="hover:cursor-pointer"
      >
        {row.getValue("message")}
      </div>
    ),
  },
  {
    accessorKey: "duration_ms",
    header: "Duration (ms)",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const n = row.getValue<number>("duration_ms");
      return typeof n === "number" ? n : "-";
    },
  },

  generateStatus(LOG_TAGS) as ColumnDef<Log, unknown>,
];
