import { format } from "date-fns";

export function formatDate(dateString?: string | null, dateFormat = "yyyy-MM-dd HH:mm") {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return format(date, dateFormat);
}
