/**
 * Shared date formatting utilities for FutsalMania.
 */

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "TODAY";

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return "TOMORROW";

  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).toUpperCase();
};

export const formatShortDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};
