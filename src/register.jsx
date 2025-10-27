import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !password || !address || !email || !phone) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    } else if (username.length <= 3 || username.includes(" ")) {
      setMessage(
        "Username cần từ 4 kí tự trở lên và không được có khoảng trống"
      );
      return;
    } else if (password.length <= 7 || password.includes(" ")) {
      setMessage(
        "Password cần từ 8 kí tự trở lên và không được có khoảng trống"
      );
      return;
    } else if (phone.includes(" ")) {
      setMessage("Số điện thoại chưa hợp lệ");
      return;
    } else if (email.includes(" ")) {
      setMessage("Email chưa hợp lệ");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/retailstore/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          address,
          phone,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Đăng ký thành công!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      setMessage("Lỗi mạng");
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#e0f7fa] to-[#f1f8e9] flex items-center justify-center text-gray-800">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg w-[90%] max-w-md p-10 flex flex-col items-center border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-1 text-teal-500">
          Tạo tài khoản mới
        </h2>

        <p className="text-sm text-gray-500 mb-8">
          Đăng ký để trở thành thành viên của chúng tôi
        </p>

        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 bg-gradient-to-r from-teal-300 to-teal-500 hover:from-teal-400 hover:to-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md"
          >
            Đăng ký
          </button>

          <button
            onClick={handleLogin}
            className="border border-teal-400 hover:bg-teal-400 hover:text-white text-teal-500 font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Quay lại đăng nhập
          </button>

          {message && (
            <p className="text-red-500 text-center text-sm mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
