import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      name: "Bảng điều khiển",
      path: "/dashboard",
      icon: "images/dashboard-logo-dashboard.png",
    },
    {
      name: "Quản lý sản phẩm",
      path: "/productsManage",
      icon: "images/dashboard-logo-product.png",
    },
    {
      name: "Quản lý người dùng",
      path: "/usersManage",
      icon: "images/dashboard-logo-users.png",
    },
    { name: "Trang chủ", path: "/homePage", icon: "images/home-page.png" },
    {
      name: "Giỏ hàng",
      path: "/cartPage",
      icon: "images/sidebar-logo-cart.png",
    },
    {
      name: "Cài đặt hệ thống",
      path: "/settingSystem",
      icon: "images/dashboard-logo-setting.png",
    },
  ];

  return (
    <>
      {!open && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      )}
      <div
        className={`fixed md:static top-0 left-0 min-h-screen w-60 bg-white border-r p-4 flex flex-col
        transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-green-600">TungWatch</h2>
            <img
              className="w-16 ml-2"
              src="images/logo-thanhtung.png"
              alt="Logo"
            />
          </div>

          <button className="md:hidden text-xl" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center p-2 rounded `}
              >
                <img src={item.icon} alt={item.name} className="w-5 h-5 mr-2" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-30"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
