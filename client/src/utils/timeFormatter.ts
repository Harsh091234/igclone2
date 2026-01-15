export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date().getTime();
  const past = new Date(date).getTime();
  const diff = Math.floor((now - past) / 1000); // seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo`;

  return `${Math.floor(diff / 31536000)}y`;
};
