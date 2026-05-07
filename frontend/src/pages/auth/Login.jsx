import { useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      toast.success("Login Successful");
      if (res.data.user.role === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">QuizPlatform</h1>
          <p className="text-zinc-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 transition-colors text-white py-3 rounded-lg font-semibold text-sm">
            Sign In
          </button>

          <p className="text-center mt-6 text-zinc-500 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;