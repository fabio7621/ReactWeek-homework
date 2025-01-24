import { useEffect } from "react";
import { Modal } from "bootstrap";
function EditModel({
  modelMode,
  closeProductModel,
  handleFileChange,
  tempProduct,
  handleImageChange,
  handleModelChange,
  updateProduct,
  prodModel,
  productRef,
  handleImageAdd,
  handleImageDel,
}) {
  useEffect(() => {
    prodModel.current = new Modal(productRef.current);
  }, []);
  return (
    <div
      ref={productRef}
      id="productModal"
      className="modal"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">
              {modelMode === "create" ? "新增產品" : "編輯產品"}
            </h5>
            <button
              onClick={closeProductModel}
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="mb-5">
                  <label htmlFor="fileInput" className="form-label">
                    {" "}
                    圖片上傳{" "}
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      name="imageUrl"
                      value={tempProduct.imageUrl}
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                      onChange={handleModelChange}
                    />
                  </div>
                  <img
                    src={tempProduct.imageUrl}
                    alt={tempProduct.title}
                    className="img-fluid"
                  />
                </div>

                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {tempProduct.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        id={`imagesUrl-${index + 1}`}
                        value={image}
                        onChange={(e) => {
                          handleImageChange(e, index);
                        }}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}
                  <div className="btn-group gap-2 w-100 mt-3">
                    {Array.isArray(tempProduct.imagesUrl) &&
                      tempProduct.imagesUrl.length < 5 &&
                      tempProduct.imagesUrl[
                        tempProduct.imagesUrl.length - 1
                      ] !== "" && (
                        <button
                          onClick={handleImageAdd}
                          className="btn btn-outline-primary btn-sm w-100 round-4"
                        >
                          新增圖片
                        </button>
                      )}
                    {Array.isArray(tempProduct.imagesUrl) &&
                      tempProduct.imagesUrl.length > 1 && (
                        <button
                          onClick={handleImageDel}
                          className="btn btn-outline-danger btn-sm w-100 round-4"
                        >
                          取消圖片
                        </button>
                      )}
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    name="title"
                    value={tempProduct.title}
                    onChange={handleModelChange}
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    name="category"
                    value={tempProduct.category}
                    onChange={handleModelChange}
                    id="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    name="unit"
                    value={tempProduct.unit}
                    onChange={handleModelChange}
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      name="origin_price"
                      value={tempProduct.origin_price}
                      onChange={handleModelChange}
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      name="price"
                      value={tempProduct.price}
                      onChange={handleModelChange}
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    name="description"
                    value={tempProduct.description}
                    onChange={handleModelChange}
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    name="content"
                    value={tempProduct.content}
                    onChange={handleModelChange}
                    id="content"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    name="is_enabled"
                    checked={tempProduct.is_enabled}
                    onChange={handleModelChange}
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              onClick={closeProductModel}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={updateProduct}
              type="button"
              className="btn btn-primary"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditModel;
