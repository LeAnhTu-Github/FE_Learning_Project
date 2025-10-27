import { Routes, Route } from "react-router-dom";

import Login from "../loginForm";
import Register from "../register";
import Dashboard from "../pages/Dashboard";
import UsersManage from "../pages/UsersManage";
import ProductsManage from "../pages/ProductsManage";
import SettingSystem from "../pages/SettingSystem";
import HomePage from "../pages/homePage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/productsManage" element={<ProductsManage />} />
      <Route path="/usersManage" element={<UsersManage />} />
      <Route path="/settingSystem" element={<SettingSystem />} />

      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/homePage" element={<HomePage />} />
    </Routes>
  );
}

export default AppRouter;
