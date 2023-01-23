export function generateProgessPercentage(total: number, completed: number) {
  return Math.round(100.0 * completed / total);
}
