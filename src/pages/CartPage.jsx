import { useEffect, useState } from "react";
import api from "../Api/Api";

function CartPage() {
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get(`/carts/${userId}`);
        console.log("Kết quả API:", res.data);
      } catch (err) {
        console.error("Lỗi tải giỏ hàng:", err);
        setError("Không thể tải giỏ hàng");
      }
    };

    if (userId) fetchCart();
  }, []);

  return <></>;
}

export default CartPage;
