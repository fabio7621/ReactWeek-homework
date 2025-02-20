export default function PagePagination({ pagination, pagesChange }) {
  return (
    <>
      <nav className="w-100 col mx-auto">
        <ul className="mx-auto pagination mt-5" style={{ width: "fit-content" }}>
          <li className={`page-item ${!pagination.has_pre && "disabled"}`} onClick={() => pagesChange(pagination.current_page - 1)}>
            <a className="page-link" href="#">
              上一頁
            </a>
          </li>

          {Array.from({ length: pagination.total_pages }).map((_, index) => (
            <li key={index} className={`page-item ${pagination.current_page === index + 1 && "active"}`}>
              <a onClick={() => pagesChange(index + 1)} className="page-link" href="#">
                {index + 1}
              </a>
            </li>
          ))}

          <li className={`page-item ${!pagination.has_next && "disabled"}`}>
            <a onClick={() => pagesChange(pagination.current_page + 1)} className="page-link" href="#">
              下一頁
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
