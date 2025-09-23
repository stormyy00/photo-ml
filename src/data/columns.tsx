// import Checkbox from "@/components/ui/checkbox";
import { Table, Row, CellContext, ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Level, LOG_TAGS } from "./tags";

// export const generateSelect = <TData extends object>() => ({
//   id: "select",
//   searchable: false,
//   size: 50,
//   header: ({ table }: { table: Table<TData> }) => (
//     <Checkbox
//       id="select-all"
//       checked={table.getIsAllRowsSelected()}
//       onClick={(e) => {
//         table.getToggleAllRowsSelectedHandler()(e);
//         table.getToggleAllRowsExpandedHandler()(e);
//       }}
//     />
//   ),
//   cell: ({ row }: { row: Row<TData> }) => (
//     <Checkbox
//       id="select-one"
//       checked={row.getIsSelected()}
//       onClick={(e) => {
//         row.getToggleSelectedHandler()(e);
//         row.getToggleExpandedHandler()();
//       }}
//     />
//   ),
// });

// export const generateAffiliation = <TData extends object>() => ({
//   accessorKey: "affiliation",
//   header: "Affiliation",
//   searchable: false,
//   cell: ({ row }: CellContext<TData, string>) => {
//     if (!row.getValue("affiliation")) {
//       return <Badge>None</Badge>;
//     }

//     const affiliation: string = row.getValue("affiliation");

//     return (
//       <Badge type={affiliation.toLowerCase()}>
//         {affiliation}
//       </Badge>
//     );
//   },
// });

export const generateStatus = <TData extends { level: Level }>(
  tags: typeof LOG_TAGS,
): ColumnDef<TData, Level> => ({
  accessorKey: "level",
  id: "level",
  header: "Level",
  enableColumnFilter: true,
  // TanStack v8 signature: (row, columnId, filterValue)
  filterFn: (row, columnId, filterValue) => {
    const lvl = row.getValue<Level>(columnId);
    // support single or multi-select filter values
    return Array.isArray(filterValue)
      ? filterValue.includes(lvl)
      : !filterValue || lvl === filterValue;
  },
  cell: ({ getValue }) => {
    const lvl = getValue() as Level;
    const tag = tags[lvl];
    return (
      <span
        className={[
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
          tag?.text,
          tag?.bg,
        ].join(" ")}
      >
        {tag?.label ?? lvl.toUpperCase()}
      </span>
    );
  },
});

export const generateTiers = <TData extends object>(
  tiers: Record<string, { text: string; bg: string; label?: string }>,
): ColumnDef<TData, string> => ({
  accessorKey: "tier",
  header: "Tier",
  enableColumnFilter: true,
  //   searchable: false,
  cell: ({ getValue }) => {
    const raw = (getValue() as string) || "free";
    return (
      <Badge className={`${tiers[raw].text} ${tiers[raw].bg}`}>
        {tiers[raw].label ?? raw.toUpperCase()}
      </Badge>
    );
  },
});
