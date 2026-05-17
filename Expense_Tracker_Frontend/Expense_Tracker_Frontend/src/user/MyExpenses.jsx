import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

export const MyExpenses = () => {

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState(1)
  const [dateSort, setDateSort] = useState(1)
  const [type, settype] = useState("expense")

  // GET DATA
  const getMyExpenses = async () => {

    try {

      const res = await axiosInstance.get(
        `/exp/expbyuserid?sort=${sort}&date=${dateSort}&type=${type}`
      )

      if (res.data && Array.isArray(res.data.data)) {

        setExpenses(res.data.data)

      } else {

        setExpenses([])
      }

    } catch (err) {

      console.error(err)
      toast.error("Failed to load data ❌")

    } finally {

      setLoading(false)
    }
  }

  // SEARCH
  const searchHanlder = async (e) => {

    try {

      const res = await axiosInstance.get(
        "/exp/search?expName=" + e.target.value
      )

      if (res.data && Array.isArray(res.data.data)) {

        setExpenses(res.data.data)

      } else {

        setExpenses([])
      }

    } catch (err) {

      console.error(err)
      toast.error("Search failed ❌")
    }
  }

  // DELETE
  const deleteExpense = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    )

    if (!confirmDelete) return

    try {

      await axiosInstance.delete(`/exp/delete/${id}`)

      setExpenses((prev) =>
        prev.filter((exp) => exp._id !== id)
      )

      toast.success("Deleted successfully ✅")

    } catch (err) {

      console.error(err)
      toast.error("Delete failed ❌")
    }
  }

  useEffect(() => {

    getMyExpenses()

  }, [sort, dateSort, type])

  return (
    <>
      {/* INTERNAL CSS */}
      <style>{`

        .glassTable {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(99,102,241,0.15);
          backdrop-filter: blur(12px);
        }

        .tableRow {
          transition: all 0.25s ease;
        }

        .tableRow:hover {
          background: rgba(99,102,241,0.08);
          transform: scale(1.01);
        }

        .searchInput {
          background: rgba(15,23,42,0.6);
          border: 1px solid rgba(99,102,241,0.2);
          color: white;
        }

        .searchInput:focus {
          outline: none;
          border-color: #818cf8;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
        }

        .sortBtn {
          transition: all 0.2s ease;
        }

        .sortBtn:hover {
          color: #818cf8;
          transform: scale(1.15);
        }

        .deleteBtn{
          transition: all .2s ease;
        }

        .deleteBtn:hover{
          transform: scale(1.08);
        }

      `}</style>

      <div
        className="min-h-screen px-4 py-12 text-white"
        style={{
          background: 'linear-gradient(135deg,#020617,#0f172a,#020617)'
        }}
      >

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center flex-wrap gap-4 mb-8">

            <div>

              <h1 className="text-3xl font-bold">
                My <span className="text-indigo-400">
                  {type === "expense" ? "Expenses" : "Income"}
                </span>
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                Manage and track your records 💸
              </p>

            </div>

            <div
              className="px-4 py-1 rounded-full text-sm border"
              style={{
                background: 'rgba(99,102,241,0.1)',
                borderColor: 'rgba(99,102,241,0.3)',
                color: '#a5b4fc'
              }}
            >
              Total: {expenses.length}
            </div>

          </div>

          {/* SEARCH + TYPE */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-end">

            <div>

              <label className="block mb-2 text-sm text-slate-300">
                Search
              </label>

              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => searchHanlder(e)}
                className="searchInput w-full md:w-96 px-4 py-3 rounded-xl"
              />

            </div>

            <div>

              <label className="block mb-2 text-sm text-slate-300">
                Type
              </label>

              <select
                onChange={(e) => settype(e.target.value)}
                className="searchInput px-4 py-3 rounded-xl"
              >
                <option value="expense">EXPENSE</option>
                <option value="income">INCOME</option>
              </select>

            </div>

          </div>

          {/* TABLE */}
          <div className="glassTable rounded-3xl overflow-hidden shadow-2xl">

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEAD */}
                <thead
                  className="border-b border-slate-800"
                  style={{
                    background: 'rgba(15,23,42,0.9)'
                  }}
                >

                  <tr className="text-left text-slate-300 text-sm uppercase">

                    <th className="px-6 py-5">Title</th>

                    <th className="px-6 py-5">Description</th>

                    <th className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        Amount

                        <button
                          className="sortBtn"
                          onClick={() => setSort(1)}
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          className="sortBtn"
                          onClick={() => setSort(-1)}
                        >
                          <ArrowDown size={16} />
                        </button>

                      </div>

                    </th>

                    <th className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        Date

                        <button
                          className="sortBtn"
                          onClick={() => setDateSort(1)}
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          className="sortBtn"
                          onClick={() => setDateSort(-1)}
                        >
                          <ArrowDown size={16} />
                        </button>

                      </div>

                    </th>

                    <th className="px-6 py-5">Category</th>

                    <th className="px-6 py-5">Mode</th>

                    <th className="px-6 py-5 text-center">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}
                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center py-14 text-slate-500"
                      >
                        Loading records...
                      </td>

                    </tr>

                  ) : expenses.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center py-14 text-slate-500"
                      >
                        No records found
                      </td>

                    </tr>

                  ) : (

                    expenses.map((ex) => (

                      <tr
                        key={ex._id}
                        className="tableRow border-b border-slate-800"
                      >

                        {/* TITLE */}
                        <td className="px-6 py-5 font-semibold text-white">
                          {ex.title}
                        </td>

                        {/* DESCRIPTION */}
                        <td className="px-6 py-5 text-slate-400 max-w-xs truncate">
                          {ex.description || "No description"}
                        </td>

                        {/* AMOUNT */}
                        <td className="px-6 py-5 text-emerald-400 font-bold">

                          ₹{
                            parseFloat(
                              type === "expense"
                                ? ex.amount
                                : ex.income
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                            })
                          }

                        </td>

                        {/* DATE */}
                        <td className="px-6 py-5 text-slate-400">
                          {new Date(ex.expenseDate).toLocaleDateString()}
                        </td>

                        {/* CATEGORY */}
                        <td className="px-6 py-5">

                          <span className="px-3 py-1 rounded-lg text-sm bg-slate-800 border border-slate-700 text-indigo-300">

                            {
                              type === "expense"
                                ? ex.expCat?.catName?.toUpperCase()
                                : ex.incomeCategory?.catName?.toUpperCase()
                            }

                          </span>

                        </td>

                        {/* PAYMENT MODE */}
                        <td className="px-6 py-5">

                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                            ex.paymentMode === 'CASH'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : ex.paymentMode === 'CARD'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : ex.paymentMode === 'UPI'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-slate-500/10 text-slate-300 border-slate-500/20'
                          }`}>

                            {ex.paymentMode || "----"}

                          </span>

                        </td>

                        {/* DELETE */}
                        <td className="px-6 py-5 text-center">

                          <button
                            onClick={() => deleteExpense(ex._id)}
                            className="deleteBtn bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 p-2 rounded-lg"
                          >

                            <Trash2 size={18} />

                          </button>

                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}