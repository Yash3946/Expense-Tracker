import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../api/axiosInstance";
import { UserPlus, WalletCards } from "lucide-react";

export const Sigup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      await axios.post("/user/create", data);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Signup failed");
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
          <h1 className="mt-14 text-4xl font-black leading-tight">Start tracking your finances with clarity.</h1>
          <p className="mt-4 text-slate-300">Create an account and organize your expenses, income, budgets, and reports.</p>
        </section>

        <section className="p-6 sm:p-10">
          <span className="pill">
            <UserPlus size={15} />
            Create account
          </span>
          <h2 className="mt-4 text-3xl font-black text-slate-950">Signup</h2>

          <form onSubmit={handleSubmit(submitHandler)} className="mt-8 grid gap-4 md:grid-cols-2">
            <Field error={errors.firstName?.message}>
              <input
                type="text"
                placeholder="First name"
                className="field-input"
                {...register("firstName", { required: "First name is required" })}
              />
            </Field>
            <Field error={errors.lastName?.message}>
              <input
                type="text"
                placeholder="Last name"
                className="field-input"
                {...register("lastName", { required: "Last name is required" })}
              />
            </Field>
            <Field error={errors.email?.message}>
              <input
                type="email"
                placeholder="Email address"
                className="field-input"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
                })}
              />
            </Field>
            <Field error={errors.password?.message}>
              <input
                type="password"
                placeholder="Password"
                className="field-input"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
            </Field>
            <input type="number" placeholder="Age" className="field-input" {...register("age")} />
            <select className="field-input" {...register("gender")}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button type="submit" className="primary-btn md:col-span-2">
              <UserPlus size={18} />
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-slate-500">
            Already registered?{" "}
            <Link to="/login" className="text-cyan-700 hover:text-cyan-900">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

const Field = ({ children, error }) => (
  <div>
    {children}
    {error && <p className="mt-2 text-sm font-bold text-rose-600">{error}</p>}
  </div>
);
