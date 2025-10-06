import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Utils/Api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auths/login", form);
      const token = res.data.token;
      const adminName = res.data.adminName || res.data.name || "";

      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);

      if (adminName) localStorage.setItem("adminName", adminName);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    }
    catch (err) {
      toast.error(err.response?.data?.error || err.message || "Login failed");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Login</h2>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full mb-3 p-3 rounded bg-transparent border border-white/30 text-white text-sm sm:text-base" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-transparent border border-white/30 text-white text-sm sm:text-base" required />
        <button type="submit" className="w-full py-3 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm sm:text-base">Login</button>
        <p className="text-center mt-4 text-sm sm:text-base">
          Don&apos;t have an account? <Link to="/signup" className="text-decoration-none fw-semibold text-green-400">Sign Up</Link>
        </p>
      </form>

    </div>
  );
};

export default Login;
