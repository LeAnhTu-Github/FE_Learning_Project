import { useEffect, useState } from "react";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get(`/carts/${userId}`);
        console.log("Kết quả API:", res.data);
        setCart(res.data.data);
      } catch (err) {
        console.error("Lỗi tải giỏ hàng:", err);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (itemId, delta) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) =>
        item.itemId === itemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item
      ),
    }));
  };

  if (!cart || cart.items.length === 0)
    return (
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded-xl ">
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/homePage")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md "
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
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded-xl shadow-md">
      <div className="flex justify-end ">
        <button
          onClick={() => navigate("/homePage")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          ⤶ Quay lại mua hàng
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🛒 Giỏ hàng của bạn
      </h2>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.itemId}
            className="flex items-center bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition justify-between"
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
                onClick={() => handleQuantityChange(item.itemId, -1)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-bold"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.itemId, 1)}
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
        <h3 className="text-2xl font-bold text-emerald-600">
          {total.toLocaleString("vi-VN")}₫
        </h3>
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
