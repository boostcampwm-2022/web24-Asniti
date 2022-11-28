export const formatDate = (
  str: string,
  options: Intl.DateTimeFormatOptions = {},
) =>
  new Date(str).toLocaleDateString('ko', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
