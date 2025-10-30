import { useEffect, useState } from "react";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get(`/carts/${userId}`);
      console.log(" Cart:", res.data.data);
      setCart(res.data.data);
    } catch (err) {
      console.error(" Lỗi tải giỏ hàng:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, delta, currentQty) => {
    const newQty = Math.max(1, currentQty + delta);

    try {
      const res = await api.put(`/carts/${userId}`, {
        items: [
          {
            productId,
            quantity: newQty,
          },
        ],
      });

      console.log("Cập nhật thành công:", res.data);

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product.productId === productId
            ? { ...item, quantity: newQty }
            : item
        ),
      }));
    } catch (err) {
      console.error(
        " Lỗi cập nhật số lượng:",
        err.response ? err.response.data : err.message
      );
    }
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
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gradient-to-b from-[#e0f7fa] to-[#f1f8e9] rounded-xl shadow-md">
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/homePage")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          ⤶ Quay lại mua hàng
        </button>
      </div>

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
                  {item.product.price.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handleQuantityChange(
                    item.product.productId,
                    -1,
                    item.quantity
                  )
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
                  handleQuantityChange(item.product.productId, 1, item.quantity)
                }
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-bold"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-5 rounded-lg shadow-sm flex justify-between items-center">
        <p className="text-lg font-semibold text-gray-700">Tổng cộng:</p>
        <h3 className="text-2xl font-bold text-emerald-600">{total}₫</h3>
      </div>

      <div className="flex justify-end mt-6">
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
          Thanh toán
        </button>
      </div>
    </div>
  );
}

export default CartPage;
