import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/search", {
          params: { keyword: "" },
        });
        console.log(res);

        const data = res.data.data.content;

        setProducts(data);
      } catch (error) {
        console.error(" Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Đăng xuất
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Danh sách sản phẩm
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.productId}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <img
                src={`/images/${p.imageUrl}`}
                alt={p.name}
                className="w-full h-80 object-cover rounded-lg mb-4"
              />

              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-gray-600">{p.description}</p>
              <p className="text-teal-600 font-bold">
                {p.price?.toLocaleString() ?? 0} ₫
              </p>
              <p className="text-sm text-gray-500">Tồn kho: {p.stock ?? 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
