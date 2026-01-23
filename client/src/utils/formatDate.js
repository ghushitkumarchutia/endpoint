import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "N/A";
  return format(new Date(date), "MMM d, yyyy HH:mm");
};

export const formatRelativeTime = (date) => {
  if (!date) return "Never";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
