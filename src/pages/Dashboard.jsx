import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
function Dashboard() {
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Users
        const resUsers = await api.get("/users/get-all-users");
        setUsers(resUsers.data.data.length);

        // Products
        const resProducts = await api.get("/products/get-all-products");
        setProducts(resProducts.data.data.length);

        // Orders + Revenue
        const resOrders = await api.get(
          "/orders/search?pageNo=0&pageSize=9999"
        );
        const orderData = resOrders.data.data;
        setOrders(orderData.totalElements);

        let total = 0;
        orderData.content.forEach((o) => {
          if (o.totalPrice) total += o.totalPrice;
        });
        setRevenue(total);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu Dashboard:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Dashboard
        </h1>

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols- gap-6">
          <Card
            label="Người dùng"
            value={users}
            color="from-blue-400 to-blue-600"
            onClick={() => navigate("/usersManage")}
          />
          <Card
            label="Sản phẩm"
            value={products}
            color="from-green-400 to-green-600"
            onClick={() => navigate("/productsManage")}
          />
          <Card
            label="Đơn hàng"
            value={orders}
            color="from-yellow-400 to-yellow-600"
          />
          <Card
            label="Doanh thu"
            value={revenue.toLocaleString() + " ₫"}
            color="from-red-400 to-red-600"
          />
        </div>
      </div>
    </div>
  );
}
function Card({ label, value, color, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`cursor-pointer bg-gradient-to-r ${color} h-60 text-white shadow-lg rounded-xl p-6`}
    >
      <p className="text-2xl font-medium opacity-90">{label}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </motion.div>
  );
}

export default Dashboard;
