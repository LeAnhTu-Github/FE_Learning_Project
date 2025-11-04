import { useEffect, useId, useState } from "react";
import api from "../Api/Api";
import Sidebar from "../components/Sidebar";

const UsersManage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
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
      const res = await api.get("/users/get-all-users");
      setUsers(res.data.data);
    } catch (err) {
      setError(" Lấy danh sách người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };
  const filteredUsers = users.filter((user) => {
    const matchId = searchId ? user.userId.toString().includes(searchId) : true;
    const matchRole = roleFilter ? user.role === roleFilter : true;
    return matchId && matchRole;
  });
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      " Bạn chắc chắn muốn xóa người dùng này ?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`users/${userId}`);

      toast.success("Xóa thành công!");

      setUsers((prev) => prev.filter((user) => user.userId !== userId));
    } catch (err) {
      toast.error("Xóa thất bại!");

      console.err(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (value) => {
    setSearchId(value);
  };
  useEffect(() => {
    const fetchUserId = async () => {
      if (!searchId) {
        fetchUsers();
        return;
      }

      try {
        const res = await api.get(`/users/find-user-by-id/${searchId}`);
        setUsers([res.data.data]);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, [searchId]);

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
      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />

      <div className="flex-1 relative p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">
          Quản lý người dùng
        </h1>
        <div className="border mb-2 border-gray-300 rounded-lg  bg-white shadow-sm w-full max-w-md ">
          <input
            type="text"
            placeholder="Nhập user cần tìm kiếm..."
            value={searchId}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full   p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <div className="overflow-x-auto shadow-lg rounded-2xl bg-white">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-left">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="ml-2 p-1 text-sm rounded-md bg-blue-600 text-white border border-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                      <option value="">Tất cả</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="USER">USER</option>
                    </select>
                  </th>
                  <th className="py-3 px-4 text-center">Action</th>
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
                    <td className="px-4 py-3">{user.userId}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">{user.address}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
                      className="text-center text-gray-500 py-6 italic"
                    >
                      Không có người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {editingUser && (
              <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Sửa người dùng</h2>
                  {[
                    "username",
                    "password",
                    "email",
                    "phone",
                    "address",
                    "role",
                  ].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="block text-sm font-medium mb-1">
                        {field}
                      </label>
                      {field === "role" ? (
                        <select
                          name={field}
                          value={formData[field]}
                          onChange={handleFormChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
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
                          className="w-full p-2 border border-gray-300 rounded-md"
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
    </div>
  );
};

export default UsersManage;
