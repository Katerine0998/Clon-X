export const PAGE_SIZE = 10;

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
}
export const paginate = <T>(list: T[], page: number, pageSize: number = PAGE_SIZE): PaginatedResult<T> => {
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: list.slice(start, start + pageSize),
    currentPage,
    totalPages,
  };
};