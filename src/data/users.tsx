"use client";
// import { generateSelect, generateStatus } from "./columns";

import { ColumnDef } from "@tanstack/react-table";
import { generateTiers } from "./columns";
import { BILLING_TAGS } from "./tags";

type User = {
  name: string;
  email: string;
  created_at: string | Date;
  total_photos: number;
  persons: number;
  tier: string;
};

// If you rely on `searchable` elsewhere, extend the type:
type Col<UserT> = ColumnDef<UserT, unknown> & { searchable?: boolean };

export const COLUMNS: Col<User>[] = [
  //   generateSelect(),
  {
    accessorFn: (row) => row.name,
    id: "name",
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: true,
    filterFn: "includesString",
    searchable: true,
    cell: ({ row }) => (
      <div
        onClick={(e) => {
          row.getToggleSelectedHandler()(e);
          row.getToggleExpandedHandler()();
        }}
        className="hover:cursor-pointer"
      >
        {row.getValue("name")}
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
    enableColumnFilter: true,
    filterFn: "includesString",
    searchable: true,
    cell: ({ row }) => (
      <div
        onClick={(e) => {
          row.getToggleSelectedHandler()(e);
          row.getToggleExpandedHandler()();
        }}
        className="hover:cursor-pointer"
      >
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const v = row.getValue("created_at") as string | Date | undefined;
      const d = v ? new Date(v) : null;
      return (
        <div className="whitespace-nowrap">
          {d ? d.toLocaleDateString() : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "total_photos",
    header: "Total Photos",
    enableColumnFilter: true,
    filterFn: "inNumberRange",
    searchable: true,
    cell: ({ row }) => (
      <div
        onClick={(e) => {
          row.getToggleSelectedHandler()(e);
          row.getToggleExpandedHandler()();
        }}
        className="hover:cursor-pointer"
      >
        {row.getValue("total_photos")}
      </div>
    ),
  },
  {
    accessorKey: "persons",
    header: "Persons",
    enableColumnFilter: true,
    filterFn: "inNumberRange",
    searchable: true,
    cell: ({ row }) => (
      <div
        onClick={(e) => {
          row.getToggleSelectedHandler()(e);
          row.getToggleExpandedHandler()();
        }}
        className="hover:cursor-pointer"
      >
        {row.getValue("persons")}
      </div>
    ),
  },
  generateTiers(BILLING_TAGS),
  //   {
  //     accessorKey: "gender",
  //     header: "Gender",
  //     enableColumnFilter: true,
  //     filterFn: "includesString",
  //     searchable: true,
  //     cell: ({ row }) => (
  //       <div
  //         onClick={(e) => {
  //           row.getToggleSelectedHandler()(e);
  //           row.getToggleExpandedHandler()();
  //         }}
  //         className="hover:cursor-pointer"
  //       >
  //         {row.getValue("gender")}
  //       </div>
  //     ),
  //   },
  //   generateAffiliation(),
  //   generateStatus(STATUSES),
];

// export const SUBCOLUMNS: (ColumnDef<Admin> & Column)[] = [
//   generateSelect(),
//   {
//     accessorKey: "grade",
//     header: "Grade",
//     enableColumnFilter: true,
//     filterFn: "includesString",
//     searchable: true,
//     cell: ({ row }) => (
//       <div
//         onClick={(e) => {
//           row.getToggleSelectedHandler()(e);
//           row.getToggleExpandedHandler()();
//         }}
//         className="hover:cursor-pointer"
//       >
//         {row.getValue("grade")}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "major",
//     header: "Major",
//     enableColumnFilter: true,
//     filterFn: "includesString",
//     searchable: true,
//     cell: ({ row }) => (
//       <div
//         onClick={(e) => {
//           row.getToggleSelectedHandler()(e);
//           row.getToggleExpandedHandler()();
//         }}
//         className="hover:cursor-pointer"
//       >
//         {row.getValue("major")}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "diet",
//     header: "Diet",
//     enableColumnFilter: true,
//     filterFn: "includesString",
//     searchable: true,
//     cell: ({ row }) => (
//       <div
//         onClick={(e) => {
//           row.getToggleSelectedHandler()(e);
//           row.getToggleExpandedHandler()();
//         }}
//         className="hover:cursor-pointer"
//       >
//         {row.getValue("diet")}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "age",
//     header: "Age",
//     enableColumnFilter: true,
//     filterFn: "includesString",
//     searchable: true,
//     cell: ({ row }) => (
//       <div
//         onClick={(e) => {
//           row.getToggleSelectedHandler()(e);
//           row.getToggleExpandedHandler()();
//         }}
//         className="hover:cursor-pointer"
//       >
//         {row.getValue("age")}
//       </div>
//     ),
//   },
// ];
