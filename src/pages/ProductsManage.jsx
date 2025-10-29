import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../Api/Api";

function ProductsManage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/search", {
        params: { keyword: "", pageNo: page, pageSize: 8 },
      });
      const data = res.data.data;

      setProducts(data.content);
      setPageInfo(data.page);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      setError("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Quản lý sản phẩm
        </h1>

        {loading && (
          <p className="text-center text-gray-600 mt-8">Đang tải dữ liệu...</p>
        )}
        {error && (
          <p className="text-center text-red-500 mt-8 font-medium">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.productId}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
                >
                  <img
                    src={`/images/${p.imageUrl}`}
                    alt={p.name}
                    className="w-full h-60 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <p className="text-gray-600">{p.description}</p>
                  <p className="text-teal-600 font-bold">
                    {p.price.toLocaleString()} ₫
                  </p>
                  <p className="text-sm text-gray-500">Tồn kho: {p.stock}</p>

                  <div className="flex justify-between mt-3 gap-2">
                    <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg">
                      ✏️ Sửa
                    </button>
                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">
                      🗑️ Xóa
                    </button>
                  </div>
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
          </>
        )}
      </div>
    </div>
  );
}

export default ProductsManage;
