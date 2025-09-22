export type Level = "info" | "error" | "warning" | "debug";

export const LOG_TAGS: Record<
  Level,
  { text: string; bg: string; label?: string }
> = {
  info: { text: "text-blue-600", bg: "bg-blue-100", label: "INFO" },
  error: { text: "text-red-600", bg: "bg-red-100", label: "ERROR" },
  warning: { text: "text-yellow-700", bg: "bg-yellow-100", label: "WARN" },
  debug: { text: "text-green-700", bg: "bg-green-100", label: "DEBUG" },
};

export const BILLING_TAGS = {
  free: { text: "text-green-600", bg: "bg-green-100", label: "FREE" },
  pro: { text: "text-blue-600", bg: "bg-blue-100", label: "PRO" },
  enterprise: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    label: "ENTERPRISE",
  },
};
