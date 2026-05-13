import React from 'react'
import { useForm } from 'react-hook-form'
import axios from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, FolderPlus } from 'lucide-react'

export const AddCategory = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const navigate = useNavigate()

  // =========================
  // SUBMIT
  // =========================
  const submitHandler = async (data) => {

    try {

      console.log("data...", data)

      // EXPENSE
      if (data.type === "expense") {

        const res = await axios.post("/expCat/", data)

        console.log(res)

        toast.success("Expense category added ✅")
      }

      // INCOME
      if (data.type === "income") {

        const res = await axios.post("/incomeCat/", data)

        console.log(res)

        toast.success("Income category added ✅")
      }

      reset()

      // NAVIGATE
      navigate("/my-categories")

    } catch (err) {

      console.log(err)

      toast.error("Failed to add category ❌")
    }
  }

  return (

    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* GLOW */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)'
        }}
      />

      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle,rgba(168,85,247,0.20),transparent 70%)'
        }}
      />

      {/* CARD */}
      <div
        className="w-full max-w-xl relative z-10 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl"
        style={{
          background: 'rgba(10,14,28,0.88)'
        }}
      >

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/my-categories")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={18} />
          Back to Categories
        </button>

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5"
            style={{
              background:
                'linear-gradient(135deg,#4f46e5,#7c3aed)'
            }}
          >
            <FolderPlus size={38} className="text-white" />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-2">
            Add <span className="text-indigo-400">Category</span>
          </h1>

          <p className="text-slate-500">
            Create expense & income categories beautifully
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-6"
        >

          {/* CATEGORY TYPE */}
          <div>

            <label className="block text-sm text-slate-300 mb-2">
              Category Type
            </label>

            <select
              {...register("type", {
                required: {
                  value: true,
                  message: "Please select category type"
                }
              })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select Type --</option>
              <option value="expense">EXPENSE</option>
              <option value="income">INCOME</option>
            </select>

            {errors.type && (
              <p className="text-red-400 text-sm mt-2">
                {errors.type.message}
              </p>
            )}

          </div>

          {/* CATEGORY NAME */}
          <div>

            <label className="block text-sm text-slate-300 mb-2">
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name..."
              {...register("catName", {
                required: "Category name is required"
              })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {errors.catName && (
              <p className="text-red-400 text-sm mt-2">
                {errors.catName.message}
              </p>
            )}

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-sm text-slate-300 mb-2">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Write description..."
              {...register("description")}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
            style={{
              background:
                'linear-gradient(135deg,#4f46e5,#7c3aed)'
            }}
          >
            Add Category 🚀
          </button>

        </form>

      </div>
    </div>
  )
}