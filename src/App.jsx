import {useState} from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  // 定義表單狀態
  const [formData,setFormData]=useState({
    username:"jxd825@hotmail.com",
    password:""
  });
  // 定義登入狀態
  const [isAuth,setIsAuth]=useState(false);
  // 定義產品狀態
  const [products,setProducts]=useState([]);
  // 定義產品列表
  const [tempProduct,setTempProduct]=useState();

  // 表單輸入
  const handleInputChange=(e)=>{
    const {name,value}=e.target;
    console.log(name,value);
    setFormData((preData)=>({
      ...preData,
      [name]:value
    }))
  };

  // 登入
  const handleSubmit=async(e)=>{
    try{
      e.preventDefault();
      const res=await axios.post(`${API_BASE}/admin/signin`,formData)
      // 取得token
      // console.log(res.data.token)
      const {token,expired}=res.data;

      // 設定 cookie & token
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;
      // 取得產品列表資料
      getProducts();
      // 切換登入狀態
      setIsAuth(true);
    }catch(error){
      setIsAuth(false);
      console.log(error.response);
    }
  };

  // 確認是否登入
  const checkLogin=async()=>{
    try{
      // 讀取cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];

      axios.defaults.headers.common['Authorization'] = token;

      const res=await axios.post(`${API_BASE}/api/user/check`)
      console.log(res.data);
    }catch(error){
      console.log(error.response?.data.message);
    }
  };

  // 取得產品
  const getProducts=async()=>{
    try{
      const res=await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      // console.log(res.data.products);
      setProducts(res.data.products);
    }catch(error){
      console.log(error.response);
    }
  };

  return (
    <>
    { !isAuth ? (
      <div className="container login">
        <form className="form-floating" onSubmit={(e)=>handleSubmit(e)}>
          <h1 className="mb-5">請先登入</h1>
          <div className="form-floating mb-3">
            <input 
              type="email" 
              className="form-control" 
              id="username" 
              placeholder="name@example.com"
              name="username"
              value={formData.username}
              onChange={(e)=>handleInputChange(e)}
            />
            <label htmlFor="username">使用者帳號</label>
          </div>
          <div className="form-floating">
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={(e)=>handleInputChange(e)}
            />
            <label htmlFor="password">使用者密碼</label>
          </div>
          <button className="btn btn-warning w-100 mt-5" type="submit">登入</button>
        </form>
      </div>
    ) : (
      <div className="container">
        {/* 功能按鈕 */}
              <div className="row mt-2">
                {/*產品列表*/}
                <div className="col-md-6">
                    <button
                      className="btn btn-danger mb-5"
                      type="button"
                      onClick={()=>checkLogin()}
                    >
                      確認是否登入
                    </button>
                    <h2 className="mb-3">產品列表</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">商品名稱</th>
                                <th scope="col">原價</th>
                                <th scope="col">售價</th>
                                <th scope="col">是否啟用</th>
                                <th scope="col">查看細節</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 列表渲染 */}
                            {
                                products.map(product=>(
                                    <tr key={product.id}>
                                        <th scope="row">{product.title}</th>
                                        <td>{product.origin_price}</td>
                                        <td>{product.price}</td>
                                        <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                                        <td>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-info"
                                                onClick={()=>setTempProduct(product)}>查看
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {/*產品明細*/}
                <div className="col-md-6">
                    <h2 className="mb-3">產品明細</h2>
                    {/* 產品顯示 */}
                    {tempProduct ? 
                        (
                            <div className="card">
                                {/* 主圖 */}
                                <img src={tempProduct.imageUrl}
                                    className="card-img-top" 
                                    alt="主圖" 
                                    style={{ width: "100%", height: "auto" }} 
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{tempProduct.title}</h5>
                                    <p className="card-text">商品描述：{tempProduct.category}</p>
                                    <p className="card-text">商品內容：{tempProduct.content}</p>
                                    <div className="d-flex mb-3">
                                        <del className="text-danger me-1">{tempProduct.origin_price}</del>元
                                        <span className="mx-1">/</span>
                                        {tempProduct.price}<span className="ms-1">元</span>
                                    </div>
                                    {/* 副圖 */}
                                    <h5 className="card-title">更多圖片</h5>
                                    <div className="d-flex flex-wrap gap-3">
                                        {
                                            tempProduct.imagesUrl?.map((url,index)=>(
                                                <img  src={url}
                                                      alt="副圖" 
                                                      style={{ height:"100px",marginRight:"10px" }} 
                                                      key={index}
                                                  />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ) :
                        (
                            <p>未選擇產品</p>
                        )
                    }
                </div>
            </div>
      </div>
    ) }
    </>
  )
}

export default App
