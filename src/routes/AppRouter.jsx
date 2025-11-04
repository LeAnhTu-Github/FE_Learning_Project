import { Routes, Route } from "react-router-dom";

import Login from "../loginForm";
import Register from "../register";
import Dashboard from "../pages/Dashboard";
import UsersManage from "../pages/UsersManage";
import UserInfor from "../pages/UserInfor";
import ProductsManage from "../pages/ProductsManage";
import SettingSystem from "../pages/SettingSystem";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import Checkout from "../pages/CheckoutPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/productsManage" element={<ProductsManage />} />
      <Route path="/usersManage" element={<UsersManage />} />
      <Route path="/settingSystem" element={<SettingSystem />} />
      <Route path="/userInfor" element={<UserInfor />} />
      <Route path="/cartPage" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />

      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/homePage" element={<HomePage />} />
    </Routes>
  );
}

export default AppRouter;
