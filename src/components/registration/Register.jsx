import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    address: "",
    domain: "",
    password: "",
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle register
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        domain: formData.domain.toLowerCase().trim(), // ✅ domain normalize
      };

      const res = await axios.post(
        "http://localhost:5000/api/admin/register",
        payload
      );

      alert(res.data.message);
      navigate("/"); // login page
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Admin Registration</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />

          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company / Institute Name"
            required
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />

          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            placeholder="Domain (example.com)"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <p className="login-text">
          Already have an account?
          <span onClick={() => navigate("/")}> Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
