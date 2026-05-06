import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const AddExpense = () => {

  const { register, handleSubmit } = useForm()
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  const getMyCategories = async () => {
    try {
      const res = await axiosInstance.get("/expCat/userCategory")
      setCategories(res.data.data)
    } catch {
      toast.error("Failed to load categories ❌")
    }
  }

  useEffect(() => {
    getMyCategories()
  }, [])

  const submitHandler = async (data) => {
    try {
      const res = await axiosInstance.post("/exp/", data)
      if (res.status === 201) {
        toast.success("Expense added successfully ✅")
        setTimeout(() => navigate("/my-expenses"), 1000)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error ❌")
    }
  }

  return (
    <>
      {/* 🔥 CSS inside component */}
      <style>{`
        .label {
          display: block;
          font-size: 13px;
          color: #cbd5f5;
          margin-bottom: 6px;
        }

        .inputStyle {
          width: 100%;
          padding: 12px 14px;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(71, 85, 105, 0.6);
          border-radius: 10px;
          color: #f1f5f9;
          outline: none;
          transition: all 0.2s ease;
        }

        .inputStyle::placeholder {
          color: #94a3b8;
        }

        .inputStyle:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 2px rgba(129,140,248,0.3);
          background: rgba(30, 41, 59, 1);
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{
          background: 'linear-gradient(135deg, #020617, #0f172a, #020617)'
        }}
      >

        <div
          className="w-full max-w-2xl rounded-2xl p-8 border shadow-xl"
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(99,102,241,0.2)',
            backdropFilter: 'blur(14px)'
          }}
        >

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Add <span className="text-indigo-400">Expense</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Track your spending efficiently
            </p>
          </div>

          <div className="h-px mb-8 bg-gradient-to-r from-indigo-500/20 to-transparent"></div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Title</label>
                <input {...register("title")} placeholder="e.g. Grocery" className="inputStyle" />
              </div>

              <div>
                <label className="label">Amount</label>
                <input type="number" {...register("amount")} placeholder="₹ 500" className="inputStyle" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Expense Date</label>
                <input type="date" {...register("expenseDate")} className="inputStyle" />
              </div>

              <div>
                <label className="label">Category</label>
                <select {...register("expCat")} className="inputStyle">
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.catName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <input {...register("description")} placeholder="Optional note..." className="inputStyle" />
            </div>

            <div>
              <label className="label">Payment Mode</label>
              <select {...register("paymentMode")} className="inputStyle">
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl font-semibold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)'
              }}
            >
              + Add Expense
            </button>

          </form>
        </div>
      </div>
    </>
  )
}