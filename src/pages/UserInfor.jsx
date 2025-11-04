import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/Api";

function UserInfor() {
  const [user, setUser] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get(`/users/find-user-by-id/${userId}`);
        console.log(res);

        setUser(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải thông tin người dùng"
        );
      }
    };
    if (userId) fetchUserInfo();
  }, [userId]);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return setMessage("Vui lòng nhập đầy đủ thông tin!");
    if (newPassword !== confirmPassword)
      return setMessage("Mật khẩu mới và xác nhận không khớp!");
    if (newPassword.length < 8)
      return setMessage("Mật khẩu mới phải có ít nhất 8 ký tự!");

    try {
      await api.post("/users/update-password", {
        username: user.username,
        oldPassword,
        newPassword,
      });
      setMessage("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-b from-[#e0f7fa] to-[#f1f8e9] shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
        Thông tin người dùng
      </h2>

      <div className="space-y-3 text-gray-700">
        <p>
          <span className="font-medium">👤 Tên:</span> {user.username}
        </p>
        <p>
          <span className="font-medium">📧 Email:</span> {user.email}
        </p>
        <p>
          <span className="font-medium">📞 SĐT:</span> {user.phone}
        </p>
        <p>
          <span className="font-medium">🏠 Địa chỉ:</span> {user.address}
        </p>
        <p>
          <span className="font-medium">🔑 Role:</span> {user.role}
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate("/homePage")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          ⤶ Quay lại mua hàng
        </button>

        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          Đổi mật khẩu
        </button>
      </div>

      {showChangePassword && (
        <div className="mt-6 p-4 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Thay đổi mật khẩu
          </h3>

          <input
            type="password"
            placeholder="Mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded-lg "
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded-lg "
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-lg "
          />

          <button
            onClick={handleChangePassword}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
          >
            Xác nhận
          </button>

          <p className="text-center mt-3 text-sm text-gray-700">{message}</p>
        </div>
      )}
    </div>
  );
}

export default UserInfor;
