import { useEffect } from "react";
import { Modal } from "bootstrap";
function DelModel({
  delProductRef,
  closeDelModel,
  tempProduct,
  handleDelProduct,
  delprodModel,
}) {
  useEffect(() => {
    delprodModel.current = new Modal(delProductRef.current);
  }, []);

  return (
    <div
      ref={delProductRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              type="button"
              className="btn-close"
              onClick={closeDelModel}
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              onClick={closeDelModel}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleDelProduct}
              type="button"
              className="btn btn-danger"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelModel;
