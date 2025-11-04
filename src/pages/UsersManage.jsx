import { useEffect, useState } from "react";
import api from "../Api/Api";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

const UsersManage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    role: "USER",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/search`, {
        params: {
          keyword: searchName || "",
          pageNo,
          pageSize,
        },
      });

      const data = res.data.data;
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchName, pageNo]);

  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter ? user.role === roleFilter : true;
    return matchRole;
  });

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Bạn chắc chắn muốn xóa người dùng này?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/carts/${userId}/clear`);
      await api.delete(`/users/${userId}`);
      toast.success("Xóa thành công!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại!");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "",
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const dataToSend = { ...formData };

      if (!dataToSend.password || dataToSend.password.trim() === "") {
        delete dataToSend.password;
      }

      if (dataToSend.phone) {
        dataToSend.phone = dataToSend.phone.toString();
      }

      await api.post(`/users/update/${editingUser.userId}`, dataToSend);
      toast.success("Cập nhật thành công!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1 relative p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-blue-600">
          Quản lý người dùng
        </h1>

        <div className="border mb-2 border-gray-300 rounded-lg bg-white shadow-sm w-full max-w-md">
          <input
            type="text"
            placeholder="Nhập user cần tìm kiếm..."
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setPageNo(0);
            }}
            className="w-full p-2 sm:p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition"
          />
        </div>

        {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto shadow-lg rounded-2xl bg-white mt-4">
          <table className="min-w-full border border-gray-200 text-sm sm:text-base">
            <thead className="bg-blue-600 text-white text-xs sm:text-sm">
              <tr>
                <th className="py-2 px-2 sm:px-4 text-left">ID</th>
                <th className="py-2 px-2 sm:px-4 text-left">Username</th>
                <th className="py-2 px-2 sm:px-4 text-left hidden sm:table-cell">
                  Email
                </th>
                <th className="py-2 px-2 sm:px-4 text-left hidden md:table-cell">
                  Phone
                </th>
                <th className="py-2 px-2 sm:px-4 text-left hidden lg:table-cell">
                  Address
                </th>
                <th className="py-2 px-2 sm:px-4 text-left">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="ml-1 p-1 text-xs sm:text-sm rounded-md bg-blue-600 text-white border border-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  >
                    <option value="">Tất cả</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                </th>
                <th className="py-2 px-2 sm:px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.userId}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-2 sm:px-4 py-2">{user.userId}</td>
                  <td className="px-2 sm:px-4 py-2">{user.username}</td>
                  <td className="px-2 sm:px-4 py-2 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-2 sm:px-4 py-2 hidden md:table-cell">
                    {user.phone}
                  </td>
                  <td className="px-2 sm:px-4 py-2 hidden lg:table-cell">
                    {user.address}
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs sm:text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-gray-500 py-4 italic"
                  >
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center space-x-3 py-4">
            <button
              disabled={pageNo === 0}
              onClick={() => setPageNo((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Trước
            </button>
            <span>
              Trang {pageNo + 1} / {totalPages}
            </span>
            <button
              disabled={pageNo + 1 >= totalPages}
              onClick={() => setPageNo((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>

          {editingUser && (
            <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50 px-4">
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-lg sm:text-xl font-bold mb-4">
                  Sửa người dùng
                </h2>
                {[
                  "username",
                  "password",
                  "email",
                  "phone",
                  "address",
                  "role",
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="block text-sm sm:text-base font-medium mb-1">
                      {field}
                    </label>
                    {field === "role" ? (
                      <select
                        name={field}
                        value={formData[field]}
                        onChange={handleFormChange}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      <input
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleFormChange}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManage;
