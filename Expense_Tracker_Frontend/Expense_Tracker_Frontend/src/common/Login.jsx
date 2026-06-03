import { useForm } from "react-hook-form";
import axios from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, WalletCards } from "lucide-react";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await axios.post("/user/login", data);
    localStorage.setItem("token", res.data.token);
    document.cookie = `token=${res.data.token}; path=/; sameSite=Lax`;

    if (res.status === 200) {
      navigate("/");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-slate-950 p-8 text-white sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-950">
              <WalletCards size={23} />
            </div>
            <div>
              <p className="text-lg font-black leading-none">ExpTrack</p>
              <p className="text-xs font-bold text-slate-400">Personal finance desk</p>
            </div>
          </div>
          <h1 className="mt-14 text-4xl font-black leading-tight">Welcome back to your money workspace.</h1>
          <p className="mt-4 text-slate-300">Sign in to manage income, expenses, reports, categories, and budgets.</p>
        </section>

        <section className="p-6 sm:p-10">
          <span className="pill">
            <LogIn size={15} />
            Sign in
          </span>
          <h2 className="mt-4 text-3xl font-black text-slate-950">Login</h2>
          <p className="mt-2 text-slate-500">Use your registered email and password.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="field-label" htmlFor="email">
                <Mail size={16} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
              />
              {errors.email && <p className="mt-2 text-sm font-bold text-rose-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="field-input"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters",
                  },
                })}
              />
              {errors.password && <p className="mt-2 text-sm font-bold text-rose-600">{errors.password.message}</p>}
            </div>

            <button type="submit" className="primary-btn w-full">
              <LogIn size={18} />
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-slate-500">
            New here?{" "}
            <Link to="/signup" className="text-cyan-700 hover:text-cyan-900">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};
