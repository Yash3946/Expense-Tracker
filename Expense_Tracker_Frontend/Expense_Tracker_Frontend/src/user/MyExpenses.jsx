import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'

export const MyExpenses = () => {

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const getMyExpenses = async () => {
    try {
      const res = await axiosInstance.get("/exp/expbyuserid")
      setExpenses(res.data.data)
    } catch {
      toast.error("Failed to load expenses ❌")
    } finally {
      setLoading(false)
    }
  }
 const searchHanlder=async(e)=>{
        console.log(e.target.value)
        const res = await axiosInstance.get("/exp/search?expName="+e.target.value)
        console.log(res.data.data) //sa -->[]
        setExpenses(res.data.data) //replace with search data [1]
        
        
    }

    const searchHanlder1=async(e)=>{
        console.log(e.target.value)
        const res = await axiosInstance.get("/exp/search1?expAmount="+e.target.value)
        console.log(res.data.data) //sa -->[]
        setExpenses(res.data.data) //replace with search data [1]
        
        
    }

  useEffect(() => {
    getMyExpenses()
  }, [])

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm("Delete this expense?")
    if (!confirmDelete) return

    try {
      await axiosInstance.delete(`/exp/delete/${id}`)
      setExpenses(prev => prev.filter(ex => ex._id !== id))
      toast.success("Deleted successfully ✅")
    } catch {
      toast.error("Delete failed ❌")
    }
  }

  return (
    <>
      {/* 🔥 INTERNAL CSS */}
      <style>{`
        .card {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(99,102,241,0.15);
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        .deleteBtn {
          background: linear-gradient(135deg,#ef4444,#dc2626);
        }

        .deleteBtn:hover {
          box-shadow: 0 8px 20px rgba(239,68,68,0.4);
        }
      `}</style>

      <div
        className="min-h-screen px-4 py-12 text-white"
        style={{
          background: 'linear-gradient(135deg,#020617,#0f172a,#020617)'
        }}
      >

        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-10 flex-wrap gap-3">
                  <div>
                    <label>Search</label>
                    <input type="text" onChange={(e)=>{searchHanlder(e)}}></input>
                    </div>

                  <div>
                     <label>Search amount</label>
                      <input type="number" onChange={(e)=>{searchHanlder1(e)}}></input>
                      </div>


            <div>
              <h1 className="text-3xl font-bold">
                My <span className="text-indigo-400">Expenses</span>
              </h1>
              <p className="text-slate-400 text-sm">
                Track and manage your spending
              </p>
            </div>

            <div className="px-4 py-1 rounded-full text-sm border"
              style={{
                background: 'rgba(99,102,241,0.1)',
                borderColor: 'rgba(99,102,241,0.3)',
                color: '#a5b4fc'
              }}>
              Total: {expenses.length}
            </div>

          </div>

          {/* States */}
          {loading ? (
            <p className="text-center text-slate-400">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center text-slate-500">No expenses found</p>
          ) : (

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {expenses.map(ex => (
                <div key={ex._id}
                  className="card p-5 rounded-2xl">

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-indigo-400">
                    {ex.title}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mt-1">
                    {ex.description || "No description"}
                  </p>

                  {/* Amount */}
                  <p className="text-emerald-400 font-bold text-lg mt-3">
                    ₹{ex.amount}
                  </p>

                  {/* Date */}
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(ex.expenseDate).toLocaleDateString()}
                  </p>

                  {/* Tags */}
                  <div className="flex justify-between mt-4 text-xs">

                    <span className="px-2 py-1 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {ex.expCat?.catName || "No Category"}
                    </span>

                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {ex.paymentMode}
                    </span>

                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteExpense(ex._id)}
                    className="deleteBtn mt-4 w-full py-2 rounded-lg text-sm font-semibold text-white transition"
                  >
                    Delete
                  </button>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </>
  )
}