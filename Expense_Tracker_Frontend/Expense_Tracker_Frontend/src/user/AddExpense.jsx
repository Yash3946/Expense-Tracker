import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CalendarDays,
  CreditCard,
  FileText,
  IndianRupee,
  Receipt,
  Save,
  Tag,
  Upload,
  Wallet,
} from "lucide-react";

export const AddExpense = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState("expense");

  const navigate = useNavigate();

  const getMyExpCategories = async () => {
    try {
      const res = await axiosInstance.get("/expCat/userCategory");
      setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const getMyIncomeCategories = async () => {
    try {
      const res = await axiosInstance.get("/incomeCat/incomeCategory");
      setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedType === "expense") {
      getMyExpCategories();
    } else {
      getMyIncomeCategories();
    }
  }, [selectedType]);

  const submitHandler = async (data) => {
    try {
      const payload = { ...data };

      if (selectedType === "income") {
        payload.income = payload.amount;
        delete payload.amount;
        payload.incomeCategory = payload.expCat;
        delete payload.expCat;
      }

      const res = await axiosInstance.post("/exp/", payload);

      if (res.status === 201) {
        if (selectedFile) {
          const formData = new FormData();
          formData.append("expId", res.data.data._id);
          formData.append("receipt", selectedFile);

          const res2 = await axiosInstance.put("/exp/uploadreceipt", formData);
          if (res2.status === 200) {
            toast.success(`${selectedType === "expense" ? "Expense" : "Income"} added with receipt`);
          } else {
            toast.warning(`${selectedType === "expense" ? "Expense" : "Income"} added but receipt upload failed`);
          }
        } else {
          toast.success(`${selectedType === "expense" ? "Expense" : "Income"} added successfully`);
        }

        navigate("/my-expenses");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page-wrap">
      <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="pill">
            <Wallet size={15} />
            New {selectedType}
          </span>
          <h1 className="section-title mt-4">Add {selectedType === "expense" ? "Expense" : "Income"}</h1>
          <p className="section-subtitle">Capture the amount, date, category, payment mode, and receipt in one place.</p>
        </div>
      </section>

      <form onSubmit={handleSubmit(submitHandler)} className="app-card overflow-hidden">
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[18rem_1fr]">
          <aside className="rounded-lg bg-slate-950 p-5 text-white">
            <p className="text-sm font-bold text-slate-300">Record Type</p>
            <div className="mt-4 grid gap-2">
              {["expense", "income"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg px-4 py-3 text-left font-black capitalize transition ${
                    selectedType === type ? "bg-white text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-400">Switching type loads the matching category list automatically.</p>
          </aside>

          <div className="grid gap-5">
            <div>
              <label className="field-label" htmlFor="title">
                <FileText size={16} />
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Groceries, salary, fuel..."
                {...register("title", { required: "Title is required" })}
                className="field-input"
              />
              {errors.title && <p className="mt-2 text-sm font-bold text-rose-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="field-label" htmlFor="description">
                <Receipt size={16} />
                Description
              </label>
              <textarea id="description" rows="4" placeholder="Optional notes" {...register("description")} className="field-input resize-none" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="amount">
                  <IndianRupee size={16} />
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0"
                  {...register("amount", { required: "Amount is required" })}
                  className="field-input"
                />
                {errors.amount && <p className="mt-2 text-sm font-bold text-rose-600">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="field-label" htmlFor="expenseDate">
                  <CalendarDays size={16} />
                  Date
                </label>
                <input id="expenseDate" type="date" {...register("expenseDate")} className="field-input" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="expCat">
                  <Tag size={16} />
                  Category
                </label>
                <select id="expCat" {...register("expCat")} className="field-input">
                  <option value="">Select category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.catName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="paymentMode">
                  <CreditCard size={16} />
                  Payment Mode
                </label>
                <select id="paymentMode" {...register("paymentMode")} className="field-input">
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="receipt">
                <Upload size={16} />
                Receipt
              </label>
              <input id="receipt" type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="field-input" />
            </div>

            <button type="submit" className="primary-btn w-full sm:w-auto">
              <Save size={18} />
              Save {selectedType === "expense" ? "Expense" : "Income"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
