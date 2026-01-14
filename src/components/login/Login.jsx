import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";


const API = import.meta.env.VITE_API_BASE_URL;
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/admin/login`, {
        email: email.toLowerCase().trim(),
        password,
      });

      alert(res.data.message);

      // ✅ STORE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      // 🔥 THIS IS THE KEY LINE
      localStorage.setItem("domain", res.data.admin.domain);

      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p className="subtitle">Welcome back, Administrator</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="register-text">
          Don’t have an account?
          <span onClick={() => navigate("/register")}> Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
