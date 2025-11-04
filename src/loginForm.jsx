import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./Api/Api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await api.post("/auth/login", { username, password });
      const token = response.data.data.token;
      const userId = response.data.data.userResponse.userId;
      console.log(response);

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response.data.message || "Đăng nhập thất bại");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#e0f7fa] to-[#f1f8e9] flex items-center justify-center text-gray-800">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg w-[90%] max-w-md p-10 flex flex-col items-center border border-gray-200">
        <img
          src="images/logo-thanhtung.png"
          alt="Logo"
          className="w-32 h-32 object-contain rounded-full mb-4"
        />

        <h2 className="text-2xl font-bold text-center mb-1 text-teal-500">
          Chào mừng đến với
        </h2>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          TungWatch
        </h1>

        <div className="w-full flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Username</label>
            <input
              type="text"
              placeholder="Nhập username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="Nhập password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-gradient-to-r from-teal-300 to-teal-500 hover:from-teal-400 hover:to-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md"
          >
            Đăng nhập
          </button>

          <button
            onClick={handleRegister}
            className="border border-teal-400 hover:bg-teal-400 hover:text-white text-teal-500 font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Đăng ký
          </button>

          {message && (
            <p className="text-red-500 text-center text-sm mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
