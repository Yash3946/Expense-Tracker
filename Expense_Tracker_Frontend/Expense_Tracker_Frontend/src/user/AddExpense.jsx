import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  Wallet,
  IndianRupee,
  CalendarDays,
  Receipt,
  FileText,
  Layers3
} from 'lucide-react'

export const AddExpense = () => {

  const {
    register,
    handleSubmit,
    reset
  } = useForm()

  const [categories, setCategories] = useState([])
  const [selectedFile, setSelectedFile] = useState("")
  const [selectedType, setSelectedType] = useState("expense")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // ================= CATEGORY =================

  const getMyExpCategories = async () => {
    try {

      const res = await axiosInstance.get("/expCat/userCategory")

      setCategories(res.data.data)

    } catch (err) {

      toast.error("Failed to load expense categories")
    }
  }

  const getMyIncomeCategories = async () => {
    try {

      const res = await axiosInstance.get("/incomeCat/incomeCategory")

      setCategories(res.data.data)

    } catch (err) {

      toast.error("Failed to load income categories")
    }
  }

  useEffect(() => {

    if (selectedType === "expense") {
      getMyExpCategories()
    } else {
      getMyIncomeCategories()
    }

  }, [selectedType])

  // ================= SUBMIT =================

  const submitHandler = async (data) => {

    try {

      setLoading(true)

      if (selectedType === "income") {

        data.income = data.amount
        delete data.amount

        data.incomeCategory = data.expCat
        delete data.expCat
      }

      const res = await axiosInstance.post("/exp/", data)

      if (res.status === 201) {

        if (selectedFile) {

          const formData = new FormData()

          formData.append(
            "expId",
            res.data.data._id
          )

          formData.append(
            "receipt",
            selectedFile
          )

          const res2 = await axiosInstance.put(
            "/exp/uploadreceipt",
            formData
          )

          if (res2.status === 200) {

            toast.success(
              `${selectedType} added with receipt ✅`
            )

          } else {

            toast.warning(
              `${selectedType} added but receipt upload failed`
            )
          }

        } else {

          toast.success(
            `${selectedType} added successfully ✅`
          )
        }

        reset()

        navigate("/my-expenses")
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Something went wrong ❌"
      )

    } finally {

      setLoading(false)
    }
  }

  return (
    <>
      <style>{`

        .mainBg {
          background:
          radial-gradient(circle at top left,#312e81 0%,transparent 30%),
          radial-gradient(circle at bottom right,#0f766e 0%,transparent 30%),
          linear-gradient(135deg,#020617,#0f172a,#020617);
        }

        .glassCard {
          background: rgba(15, 23, 42, 0.70);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 10px 40px rgba(0,0,0,0.45);
        }

        .inputField {
          background: rgba(15,23,42,0.65);
          border: 1px solid rgba(99,102,241,0.18);
          color: white;
          transition: 0.3s ease;
        }

        .inputField::placeholder {
          color: #94a3b8;
        }

        .inputField:focus {
          outline: none;
          border-color: #818cf8;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
        }

        .submitBtn {
          background: linear-gradient(135deg,#6366f1,#4f46e5);
        }

        .submitBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        }

        .typeBtn {
          transition: 0.3s ease;
        }

        .activeType {
          background: linear-gradient(135deg,#6366f1,#4338ca);
          color: white;
          box-shadow: 0 5px 20px rgba(99,102,241,0.35);
        }

      `}</style>

      <div className="mainBg min-h-screen flex items-center justify-center px-4 py-10 text-white">

        <div className="glassCard w-full max-w-4xl rounded-3xl p-8">

          {/* HEADER */}

          <div className="text-center mb-10">

            <div className="flex justify-center mb-4">

              <div className="bg-indigo-500/20 p-4 rounded-2xl">

                <Wallet
                  size={40}
                  className="text-indigo-400"
                />

              </div>

            </div>

            <h1 className="text-4xl font-bold">

              Add

              <span className="text-indigo-400">

                {" "}

                {
                  selectedType === "expense"
                    ? "Expense"
                    : "Income"
                }

              </span>

            </h1>

            <p className="text-slate-400 mt-3">
              Manage your finances smartly 🚀
            </p>

          </div>

          {/* TYPE BUTTONS */}

          <div className="flex justify-center gap-4 mb-8">

            <button
              type="button"
              onClick={() => setSelectedType("expense")}
              className={`typeBtn px-6 py-3 rounded-xl font-semibold border border-indigo-500/20
              ${
                selectedType === "expense"
                  ? "activeType"
                  : "bg-slate-800/60 text-slate-300"
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => setSelectedType("income")}
              className={`typeBtn px-6 py-3 rounded-xl font-semibold border border-emerald-500/20
              ${
                selectedType === "income"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-800/60 text-slate-300"
              }`}
            >
              Income
            </button>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-6"
          >

            {/* TITLE */}

            <div>

              <label className="text-sm mb-2 text-slate-300 flex items-center gap-2">

                <Receipt size={16} />

                Title

              </label>

              <input
                type="text"
                placeholder={`Enter ${selectedType} title`}
                {...register("title")}
                className="inputField w-full px-4 py-3 rounded-xl"
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="text-sm mb-2 text-slate-300 flex items-center gap-2">

                <FileText size={16} />

                Description

              </label>

              <textarea
                rows="4"
                placeholder="Enter details..."
                {...register("description")}
                className="inputField w-full px-4 py-3 rounded-xl"
              />

            </div>

            {/* AMOUNT + DATE */}

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="text-sm mb-2 text-slate-300 flex items-center gap-2">

                  <IndianRupee size={16} />

                  Amount

                </label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  {...register("amount")}
                  className="inputField w-full px-4 py-3 rounded-xl"
                />

              </div>

              <div>

                <label className="text-sm mb-2 text-slate-300 flex items-center gap-2">

                  <CalendarDays size={16} />

                  Date

                </label>

                <input
                  type="date"
                  {...register("expenseDate")}
                  className="inputField w-full px-4 py-3 rounded-xl"
                />

              </div>

            </div>

            {/* CATEGORY + PAYMENT */}

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="text-sm mb-2 text-slate-300 flex items-center gap-2">

                  <Layers3 size={16} />

                  Category

                </label>

                <select
                  {...register("expCat")}
                  className="inputField w-full px-4 py-3 rounded-xl"
                >

                  <option value="">
                    Select Category
                  </option>

                  {
                    categories?.map((cat) => (

                      <option
                        key={cat._id}
                        value={cat._id}
                      >
                        {cat.catName}
                      </option>

                    ))
                  }

                </select>

              </div>

              <div>

                <label className="text-sm mb-2 text-slate-300">
                  Payment Mode
                </label>

                <select
                  {...register("paymentMode")}
                  className="inputField w-full px-4 py-3 rounded-xl"
                >

                  <option value="CASH">Cash</option>

                  <option value="CARD">Card</option>

                  <option value="UPI">UPI</option>

                  <option value="CHEQUE">Cheque</option>

                </select>

              </div>

            </div>

            {/* FILE */}

            <div>

              <label className="text-sm mb-2 text-slate-300">
                Upload Receipt
              </label>

              <input
                type="file"
                onChange={(event) =>
                  setSelectedFile(event.target.files[0])
                }
                className="inputField w-full px-4 py-3 rounded-xl"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="submitBtn w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50"
            >

              {
                loading
                  ? "Processing..."
                  : `Add ${selectedType}`
              }

            </button>

          </form>

        </div>

      </div>
    </>
  )
}