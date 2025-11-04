import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../Api/Api";
import { toast } from "react-toastify";

function ProductsManage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    stock: 0,
  });
  const fetchProducts = async (keyword = "", pageNo = page) => {
    try {
      setLoading(true);
      const res = await api.get("/products/search", {
        params: { keyword, pageNo, pageSize: 8 },
      });
      const data = res.data.data;
      setProducts(data.content);
      setPageInfo(data.page);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Bạn chắc chắn muốn xóa sản phẩm này?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${productId}`);
      toast.success("Xóa sản phẩm thành công!");
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch (err) {
      console.error(err);
      toast.error("Xóa sản phẩm thất bại!");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
  };

  const handleSave = async () => {
    try {
      await api.post(`/products/update/${editingProduct.productId}`, formData);
      toast.success("Sửa sản phẩm thành công!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Sửa sản phẩm thất bại!");
    }
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setPage(0);
    fetchProducts(value, 0);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 relative">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          Quản lý sản phẩm
        </h1>
        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="Nhập sản phẩm muốn tìm"
            value={searchKeyword}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md p-2 w-1/2"
          />
        </div>

        {loading && (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="overflow-x-auto shadow-lg rounded-2xl bg-white">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                <th className="py-3 px-4 text-left">Mô tả</th>
                <th className="py-3 px-4 text-left">Giá</th>
                <th className="py-3 px-4 text-left">Hình ảnh</th>
                <th className="py-3 px-4 text-left">Tồn kho</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr
                  key={p.productId}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3">{p.productId}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.description}</td>
                  <td className="px-4 py-3">{p.price.toLocaleString()} ₫</td>
                  <td className="px-4 py-3">
                    <img
                      src={`/images/${p.imageUrl}`}
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.productId)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {editingProduct && (
            <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Sửa sản phẩm</h2>

                {["name", "description", "price", "imageUrl", "stock"].map(
                  (field) => (
                    <div className="mb-3" key={field}>
                      <label className="block text-sm font-medium mb-1">
                        {field}
                      </label>
                      <input
                        type={
                          field === "price" || field === "stock"
                            ? "number"
                            : "text"
                        }
                        name={field}
                        value={formData[field]}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  )
                )}

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6 gap-4">
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

export default ProductsManage;
