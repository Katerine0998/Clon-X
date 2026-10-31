interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginación">
      {/* STYLE: Bootstrap pagination. Try "pagination-sm" or "pagination-lg" on the ul */}
      <ul className="pagination justify-content-center mt-4">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            Anterior
          </button>
        </li>

        {pages.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
            <button type="button" className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};