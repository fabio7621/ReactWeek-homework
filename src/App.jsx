import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);

  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example",
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setAccount({
      ...account,
      [name]: value,
    });
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/v2/api/${apiPath}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      alert("取得產品失敗");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${apiUrl}/v2/admin/signin`, account);

      const { token, expired } = res.data;
      document.cookie = `fabio20=${token}; expires=${new Date(expired)}`;

      getProducts();
      setIsAuth(true);
    } catch (error) {
      alert("登入失敗");
    }
  };

  const checkUserLogin = async () => {
    try {
      await axios.post(`${apiUrl}/v2/api/user/check`);
      getProducts();
      setIsAuth(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUserLogin();
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)fabio20\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common["Authorization"] = token;
  }, []);
  //model
  const productRef = useRef(null);
  const prodModel = useRef(null);
  const delProductRef = useRef(null);
  const delprodModel = useRef(null);
  const [modelMode, setModelMode] = useState(null);

  useEffect(() => {
    prodModel.current = new Modal(productRef.current);
    delprodModel.current = new Modal(delProductRef.current);
  }, []);
  //產品跳窗
  const openProductModel = (mode, product) => {
    setModelMode(mode);
    if (mode === "edit") {
      setTempProduct(product);
    } else if (mode === "create") {
      setTempProduct({
        imageUrl: "",
        title: "",
        category: "",
        unit: "",
        origin_price: "",
        price: "",
        description: "",
        content: "",
        is_enabled: 0,
        imagesUrl: [""],
      });
    }

    prodModel.current.show();
  };
  const closeProductModel = () => {
    prodModel.current.hide();
  };
  //刪除跳窗
  const openDelModel = (product) => {
    delprodModel.current.show();
    setTempProduct(product);
  };
  const closeDelModel = () => {
    delprodModel.current.hide();
  };
  //product
  //表單內操作
  const [tempProduct, setTempProduct] = useState({
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""],
  });

  const handleModelChange = (e) => {
    const { value, name, type, checked } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === "checked" ? checked : value,
    });
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleImageAdd = () => {
    const newImages = [...tempProduct.imagesUrl, ""];
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };
  const handleImageDel = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  //新增更新產品api
  const createProduct = async () => {
    try {
      await axios.post(`${apiUrl}/v2/api/${apiPath}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      alert("新增產品失敗");
    }
  };
  const editProduct = async () => {
    try {
      await axios.put(`${apiUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      alert("更新產品失敗");
    }
  };
  const updateProduct = async () => {
    const apiCall = modelMode === "create" ? createProduct : editProduct;
    try {
      await apiCall();
      getProducts();
      closeProductModel();
    } catch (error) {
      alert("更新產品失敗");
    }
  };

  const delProduct = async () => {
    try {
      await axios.delete(`${apiUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`);
    } catch (error) {
      alert("刪除產品失敗");
    }
  };

  const handleDelProduct = async () => {
    try {
      await delProduct();
      getProducts();
      closeDelModel();
    } catch (error) {
      alert("刪除產品失敗");
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container py-5">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between">
                <h2>產品列表</h2>
                <button onClick={() => openProductModel("create")} type="button" className="btn btn-primary">
                  新增產品
                </button>
              </div>

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
                      <td>{product.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span>}</td>
                      <td>
                        <div className="btn-group">
                          <button onClick={() => openProductModel("edit", product)} type="button" className="btn btn-outline-primary btn-sm">
                            編輯
                          </button>
                          <button onClick={() => openDelModel(product)} type="button" className="btn btn-outline-danger btn-sm">
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                name="username"
                value={account.username}
                onChange={handleInputChange}
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                name="password"
                value={account.password}
                onChange={handleInputChange}
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      <div ref={productRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">{modelMode === "create" ? "新增產品" : "編輯產品"}</h5>
              <button onClick={closeProductModel} type="button" className="btn-close" aria-label="Close"></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
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
                    <img src={tempProduct.imageUrl} alt={tempProduct.title} className="img-fluid" />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label htmlFor={`imagesUrl-${index + 1}`} className="form-label">
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
                        {image && <img src={image} alt={`副圖 ${index + 1}`} className="img-fluid mb-2" />}
                      </div>
                    ))}
                    <div className="btn-group gap-2 w-100 mt-3">
                      {Array.isArray(tempProduct.imagesUrl) &&
                        tempProduct.imagesUrl.length < 5 &&
                        tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== "" && (
                          <button onClick={handleImageAdd} className="btn btn-outline-primary btn-sm w-100 round-4">
                            新增圖片
                          </button>
                        )}
                      {Array.isArray(tempProduct.imagesUrl) && tempProduct.imagesUrl.length > 1 && (
                        <button onClick={handleImageDel} className="btn btn-outline-danger btn-sm w-100 round-4">
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
              <button onClick={closeProductModel} type="button" className="btn btn-secondary">
                取消
              </button>
              <button onClick={updateProduct} type="button" className="btn btn-primary">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={delProductRef} className="modal fade" id="delProductModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button type="button" className="btn-close" onClick={closeDelModel}></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button onClick={closeDelModel} type="button" className="btn btn-secondary">
                取消
              </button>
              <button onClick={handleDelProduct} type="button" className="btn btn-danger">
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
