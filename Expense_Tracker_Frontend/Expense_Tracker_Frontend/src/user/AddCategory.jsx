import React from 'react'
import { useForm } from 'react-hook-form'
import axios from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const AddCategory = () => {

  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/expCat/", data)

      if (res.status === 201) {
        toast.success("Category added successfully ✅")
        setTimeout(() => {
          navigate("/my-categories")
        }, 1200)
      }

    } catch (err) {
      toast.error("Error adding category ❌")
    }
  }

  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Glow Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)' }} />

      <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)' }} />

      {/* Card */}
      <div className="w-full max-w-xl relative z-10"
        style={{
          background: 'rgba(15,19,35,0.85)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 24,
          padding: '36px',
          backdropFilter: 'blur(12px)'
        }}
      >

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-extrabold text-white">
            Add <span className="text-indigo-400">Category</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Organize your expenses
          </p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              Category Name
            </label>

            <input
              type="text"
              {...register("catName", { required: true })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              Description
            </label>

            <input
              type="text"
              {...register("description")}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 transition-all text-white font-semibold rounded-xl shadow-lg"
          >
            Add Category
          </button>

        </form>
      </div>
    </div>
  )
}