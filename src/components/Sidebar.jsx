import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

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
      name: "Cài đặt hệ thống",
      path: "/settingSystem",
      icon: "images/dashboard-logo-setting.png",
    },
  ];

  return (
    <div className="w-64 h-screen flex flex-col bg-white border-r border-gray-200 p-6 shadow-sm">
      <div className="flex items-center">
        <h2 className="text-2xl  font-bold text-emerald-600  text-left">
          TungWatch
        </h2>
        <img className=" w-20" src="images/logo-thanhtung.png" alt="" />
      </div>

      <div className="flex flex-col space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-semibold shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6 mr-3" />
              <span className="text-base">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
