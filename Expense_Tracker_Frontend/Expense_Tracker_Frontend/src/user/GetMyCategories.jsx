import React, { useEffect, useState } from 'react'
import axios from '../api/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const GetMyCategories = () => {

  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  const getAllCategories = async () => {
    try {
      const res = await axios.get("/expCat/userCategory")
      setCategories(res.data.data)
    } catch (err) {
      toast.error("Failed to load categories ❌")
    }
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm("Are you sure?")
    if (!confirmDelete) return

    try {
      await axios.delete(`/expCat/deletecat/${id}`)
      setCategories(prev => prev.filter(cat => cat._id !== id))
      toast.success("Deleted successfully ✅")
    } catch (err) {
      toast.error("Delete failed ❌")
    }
  }

  return (
    <div className="min-h-screen bg-[#080b14] px-4 py-10 relative overflow-hidden text-slate-200">

      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Glow Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)' }} />

      <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">

          <div>
            <h1 className="text-3xl font-extrabold text-white">
              My <span className="text-indigo-400">Categories</span>
            </h1>
            <p className="text-slate-500 text-sm">
              Manage your expense categories
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm border border-indigo-500/20">
              Total: {categories.length}
            </span>

            <button
              onClick={() => navigate("/add-category")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
            >
              + Add
            </button>
          </div>

        </div>

        {/* Empty State */}
        {categories.length === 0 ? (
          <div className="text-center mt-20 text-slate-500">
            No categories found 😢
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {categories.map((category) => (
              <div
                key={category._id}
                className="relative p-5 rounded-2xl border border-slate-800 backdrop-blur-lg transition-all hover:scale-[1.03]"
                style={{
                  background: 'rgba(15,19,35,0.85)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                }}
              >

                {/* Top glow line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
                  style={{
                    background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.6),transparent)'
                  }}
                />

                {/* Category Name */}
                <h2 className="text-lg font-semibold text-indigo-400 mb-2">
                  {category.catName}
                </h2>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4">
                  {category.description || "No description"}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center">

                  <span className="text-xs text-slate-600">
                    ID: {category._id.slice(-5)}
                  </span>

                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="px-3 py-1 text-xs rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  )
}