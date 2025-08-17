import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format a date to a readable string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }

  return format(dateObj, 'MMM dd, yyyy');
}

/**
 * Format a date to a long format (e.g., "January 15, 2024")
 */
export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }

  return format(dateObj, 'MMMM dd, yyyy');
}

/**
 * Format a date to show relative time (e.g., "2 days ago")
 */
export function formatDateRelative(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format a date to ISO string (e.g., "2024-01-15")
 */
export function formatDateISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return '';
  }

  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Format a date to a custom format
 */
export function formatDateCustom(
  date: Date | string,
  formatString: string
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }

  return format(dateObj, formatString);
}

/**
 * Get the year from a date
 */
export function getYear(date: Date | string): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return 0;
  }

  return dateObj.getFullYear();
}
