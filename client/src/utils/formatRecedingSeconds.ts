export const formatTimeVerbose = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};