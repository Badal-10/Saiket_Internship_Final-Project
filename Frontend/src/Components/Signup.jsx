  import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Utils/Api";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auths/signup", form);
      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Signup failed");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange}
          className="w-full mb-3 p-3 rounded bg-transparent border border-white/30 text-white" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full mb-3 p-3 rounded bg-transparent border border-white/30 text-white" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-transparent border border-white/30 text-white" required />
        <button type="submit" className="w-full py-3 rounded bg-gradient-to-r from-green-500 to-teal-500 text-white">Sign up</button>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login"  className="text-decoration-none fw- text-blue-800">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
