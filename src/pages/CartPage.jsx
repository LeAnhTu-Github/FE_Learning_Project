import { useEffect, useState } from "react";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function CartPage() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get(`/carts/${userId}`);
      console.log("Cart:", res.data.data);
      setCart(res.data.data);
    } catch (err) {
      console.error("Lỗi tải giỏ hàng:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (cartItemId, delta, currentQty) => {
    const newQty = Math.max(1, currentQty + delta);

    try {
      const res = await api.post("/carts/add-cart", {
        cartIemId: cartItemId, // 👈 đổi đúng tên field theo Swagger
        quantity: newQty,
      });

      console.log("Cập nhật thành công:", res.data);

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.itemId === cartItemId ? { ...item, quantity: newQty } : item
        ),
      }));
    } catch (err) {
      console.error(
        "Lỗi cập nhật số lượng:",
        err.response ? err.response.data : err.message
      );
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(`/carts/${userId}/remove-item/${productId}`);
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item) => item.product.productId !== productId
        ),
      }));
      console.log("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await api.delete(`/carts/${userId}/clear`);
      setCart((prev) => ({ ...prev, items: [] }));
      console.log("Đã xóa toàn bộ giỏ hàng");
    } catch (err) {
      console.error("Lỗi khi xóa toàn bộ giỏ:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!cart || cart.items.length === 0)
    return (
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded-xl">
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/homePage")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
          >
            ⤶ Quay lại mua hàng
          </button>
        </div>
        <div className="text-center text-gray-500 text-lg font-medium mt-10">
          Giỏ hàng trống.
        </div>
      </div>
    );

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <div className="flex-1 mt-6 px-4 sm:px-6 lg:px-10">
        <div className="mt-10 p-2 md:px-6 bg-gradient-to-b from-[#e0f7fa] to-[#f1f8e9] rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Giỏ hàng của bạn
          </h2>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.itemId}
                className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="flex items-center">
                  <img
                    src={`/images/${item.product.imageUrl.trim()}`}
                    alt={item.product.name}
                    className="w-24 h-24 object-contain rounded-lg bg-gray-100 mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-emerald-600 font-semibold mt-2">
                      {item.product.price}₫
                    </p>
                  </div>
                </div>

                <div className="flex items-center md:space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.itemId, -1, item.quantity)
                    }
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.itemId, 1, item.quantity)
                    }
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-bold"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleRemoveItem(item.product.productId)}
                    className="ml-3 text-red-600 hover:text-red-800 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-5 rounded-lg shadow-sm flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-700">Tổng cộng:</p>
            <h3 className="text-2xl font-bold text-emerald-600">{total}₫</h3>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              🗑️ Xóa toàn bộ
            </button>

            <button
              onClick={handleCheckout}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Mua Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
