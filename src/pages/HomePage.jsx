import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1 });
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await api.get("/products/search", {
        params: { keyword, pageNo: page, pageSize: 4 },
      });
      console.log(res);
      const data = res.data.data;
      setProducts(data.content);
      setPageInfo(data.page);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [page]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8 relative">
        <div className="flex justify-end mb-4 relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Tài khoản
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/userInfor");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Danh sách sản phẩm
        </h1>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border border-gray-300 rounded-l-lg p-2 w-1/2"
          />
          <button
            onClick={() => {
              setPage(0);
              handleSearch();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
          >
            Tìm kiếm
          </button>
        </div>

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
              <p className="text-teal-600 font-bold">{p.price} ₫</p>
              <p className="text-sm text-gray-500">Tồn kho: {p.stock}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-4 items-center">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded-lg disabled:opacity-50"
          >
            Trang trước
          </button>

          <span className="text-gray-700 font-medium">
            Trang {page + 1} / {pageInfo.totalPages}
          </span>

          <button
            disabled={page + 1 === pageInfo.totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded-lg disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
