export const generateSlug = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}