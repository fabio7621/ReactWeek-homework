import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import EditModel from "./component/editModel";
import DelModel from "./component/DelModel";

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

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${apiUrl}/v2/api/${apiPath}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      alert(`取得產品失敗,${error}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${apiUrl}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `fabio20=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common["Authorization"] = token;
      getProducts();
      setIsAuth(true);
    } catch (error) {
      alert(`登入失敗,${error}`);
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
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)fabio20\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    checkUserLogin();
  }, []);
  //model
  const prodModel = useRef(null);
  const productRef = useRef(null);
  const delProductRef = useRef(null);
  const delprodModel = useRef(null);
  const [modelMode, setModelMode] = useState(null);

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
      await axios.put(
        `${apiUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        }
      );
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
      await axios.delete(
        `${apiUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`
      );
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
  //分頁
  const [pagination, setPagination] = useState({});

  const pagesChange = (page) => {
    getProducts(page);
  };
  //上傳
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file-to-upload", file);
    try {
      const res = await axios.post(
        `${apiUrl}/v2/api/${apiPath}/admin/upload`,
        formData
      );
      const uploadImageUrl = res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadImageUrl,
      });
    } catch (error) {
      alert(`上傳錯誤,${error}`);
    }
  };
  return (
    <>
      {isAuth ? (
        <ProductPage
          openProductModel={openProductModel}
          openDelModel={openDelModel}
          pagesChange={pagesChange}
          pagination={pagination}
          products={products}
        />
      ) : (
        <LoginPage
          handleInputChange={handleInputChange}
          handleLogin={handleLogin}
          account={account}
        />
      )}
      <EditModel
        modelMode={modelMode}
        prodModel={prodModel}
        productRef={productRef}
        closeProductModel={closeProductModel}
        handleFileChange={handleFileChange}
        tempProduct={tempProduct}
        handleImageChange={handleImageChange}
        handleModelChange={handleModelChange}
        updateProduct={updateProduct}
        handleImageAdd={handleImageAdd}
        handleImageDel={handleImageDel}
      />
      <DelModel
        delprodModel={delprodModel}
        delProductRef={delProductRef}
        closeDelModel={closeDelModel}
        tempProduct={tempProduct}
        handleDelProduct={handleDelProduct}
      />
    </>
  );
}

export default App;