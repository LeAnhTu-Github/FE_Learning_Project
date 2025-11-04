import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/Api";
import Sidebar from "../components/Sidebar";

function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    api.get(`/carts/${userId}`).then((res) => setCart(res.data.data));
  }, []);
  const handleCheckout = async () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    if (!cart || !cart.items.length) {
      alert("Giỏ hàng trống!");
      return;
    }

    const orderData = {
      shippingAddress: address,
      userId,
      items: cart.items.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
      })),
    };
    console.log(orderData);

    try {
      const res = await api.post("/orders", orderData);
      console.log(orderData);

      alert("Đặt hàng thành công!");
      navigate("/homePage");
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đặt hàng thất bại!");
    }
  };

  if (!cart || cart.items.length === 0)
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 text-center">
        <p className="text-gray-500 mb-6">
          Giỏ hàng trống, không thể thanh toán.
        </p>
        <button
          onClick={() => navigate("/homePage")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          ⤶ Quay lại mua hàng
        </button>
      </div>
    );

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 mt-8 p-4 md:p-8">
        <h2 className="text-xl font-bold text-center mb-6">Thanh toán</h2>

        <div className="space-y-3">
          {cart.items.map((item) => (
            <div
              key={item.itemId}
              className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg p-3 shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`/images/${item.product.imageUrl.trim()}`}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-emerald-600">{item.product.price}₫</p>
                  <p className="text-gray-500 text-sm">SL: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center bg-white p-4 rounded shadow">
          <p className="font-semibold">Tổng cộng:</p>
          <h3 className="text-xl font-bold text-emerald-600">{total}₫</h3>
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow space-y-4">
          <h3 className="font-semibold text-lg">Thông tin giao hàng</h3>

          <input
            type="text"
            placeholder="Nhập địa chỉ nhận hàng"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/cartPage")}
            className="bg-gray-300 text-black px-2 md:px-10 py-2 rounded hover:bg-gray-400"
          >
            ⤶ Quay lại giỏ hàng
          </button>

          <button
            onClick={handleCheckout}
            className="bg-emerald-600 text-white px-2 md:px-10 py-2 rounded hover:bg-emerald-700"
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
