import { useState } from "react";
import { paginate, PAGE_SIZE } from "../utils/paginate";

export const usePagination = <T>(list: T[], pageSize: number = PAGE_SIZE) => {
  const [page, setPage] = useState(1);
  const { items, currentPage, totalPages } = paginate(list, page, pageSize);

  return { items, currentPage, totalPages, setPage };
};