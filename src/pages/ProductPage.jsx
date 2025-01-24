function ProductPage({
  openProductModel,
  openDelModel,
  pagesChange,
  pagination,
  products,
}) {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between">
            <h2>產品列表</h2>
            <button
              onClick={() => openProductModel("create")}
              type="button"
              className="btn btn-primary"
            >
              新增產品
            </button>
          </div>
          <div className="d-flex justify-content-center"></div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.title}</th>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>
                    {product.is_enabled ? (
                      <span className="text-success">啟用</span>
                    ) : (
                      <span>未啟用</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        onClick={() => openProductModel("edit", product)}
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => openDelModel(product)}
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>{" "}
          <nav className="col">
            <ul className="pagination mt-5" style={{ width: "fit-content" }}>
              <li
                className={`page-item ${!pagination.has_pre && "disabled"}`}
                onClick={() => pagesChange(pagination.current_page - 1)}
              >
                <a className="page-link" href="#">
                  上一頁
                </a>
              </li>

              {Array.from({ length: pagination.total_pages }).map(
                (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      pagination.current_page === index + 1 && "active"
                    }`}
                  >
                    <a
                      onClick={() => pagesChange(index + 1)}
                      className="page-link"
                      href="#"
                    >
                      {index + 1}
                    </a>
                  </li>
                )
              )}

              <li className={`page-item ${!pagination.has_next && "disabled"}`}>
                <a
                  onClick={() => pagesChange(pagination.current_page + 1)}
                  className="page-link"
                  href="#"
                >
                  下一頁
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
