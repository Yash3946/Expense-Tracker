import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const AddExpense = () => {

  const { register, handleSubmit } = useForm()

  const [categories, setCategories] = useState([])
  const [selectedFile, setSelectedFile] = useState("")
  const [selectedType, setselectedType] = useState("expense")
  const navigate = useNavigate()

    const getMyExpCategories = async()=>{
    const res = await axiosInstance.get("/expCat/userCategory")
    console.log(res.data.data)
    setCategories(res.data.data)
}
    const getMyIncomeCategories = async()=>{
        const res = await axiosInstance.get("/incomeCat/incomeCategory")
        console.log(res.data.data)
        setCategories(res.data.data)
    }

  useEffect(() => {
   if(selectedType == "expense"){
        getMyExpCategories()
      }else{
        getMyIncomeCategories()
      }
    },[selectedType])

  const submitHandler = async (data) => {

    try {

        if(selectedType =="income"){
          alert("income")
          data.income = data.amount
          delete data.amount
          data.incomeCategory = data.expCat
          delete data.expCat
          
        }
      const res = await axiosInstance.post("/exp/", data)

      if (res.status === 201) {

        // FILE UPLOAD
        if (selectedFile) {

          const formData = new FormData()

          formData.append("expId", res.data.data._id)
          formData.append("receipt", selectedFile)

          const res2 = await axiosInstance.put(
            "/exp/uploadreceipt",
            formData
          )

          if (res2.status === 200) {
            toast.success("Expense added with receipt ✅")
            navigate("/my-expenses")
          } else {
            toast.warning("Expense added but receipt failed ⚠️")
            navigate("/my-expenses")
          }

        } else {
          toast.success("Expense added successfully ✅")
          navigate("/my-expenses")
        }
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ❌")
    }
  }

  return (
    <>
      {/* INTERNAL CSS */}
      <style>{`
        .glassCard {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(99,102,241,0.15);
          backdrop-filter: blur(12px);
        }

        .inputField {
          background: rgba(15,23,42,0.5);
          border: 1px solid rgba(99,102,241,0.2);
          color: white;
          transition: all 0.3s ease;
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
      `}</style>

      <div
        className="min-h-screen px-4 py-12 text-white flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg,#020617,#0f172a,#020617)'
        }}
      >

        <div className="glassCard w-full max-w-3xl rounded-3xl p-8">

          {/* HEADER */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Add <span className="text-indigo-400">Expense</span>
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Track your spending smartly 💸
            </p>
          </div>
             <div className="flex">
          <label>SELECT CATEGORY TYPE</label>
          <select onChange={(e)=>setselectedType(e.target.value)}>
            <option value="expense">EXPENSE</option>
            <option value="income">INCOME</option>
          </select>
        </div>
          {/* FORM */}
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-6"
          >

            {/* TITLE */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Expense Title
              </label>

              <input
                type="text"
                placeholder="Enter expense title"
                {...register("title")}
                className="inputField w-full px-4 py-3 rounded-xl"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Description
              </label>

              <textarea
                rows="3"
                placeholder="Expense details..."
                {...register("description")}
                className="inputField w-full px-4 py-3 rounded-xl"
              />
            </div>

            {/* AMOUNT + DATE */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="text-sm text-slate-300 mb-2 block">
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
                <label className="text-sm text-slate-300 mb-2 block">
                  Expense Date
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
                <label className="text-sm text-slate-300 mb-2 block">
                  Category
                </label>

                <select
                  {...register("expCat")}
                  className="inputField w-full px-4 py-3 rounded-xl"
                >
                  <option value="">Select Category</option>

                  {categories?.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.catName}
                    </option>
                  ))}

                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">
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
              <label className="text-sm text-slate-300 mb-2 block">
                Upload Receipt
              </label>

              <input
                type="file"
                onChange={(event) => {
                  setSelectedFile(event.target.files[0])
                }}
                className="inputField w-full px-4 py-3 rounded-xl"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="submitBtn w-full py-3 rounded-xl font-semibold text-white transition-all duration-300"
            >
              Add Expense
            </button>

          </form>
        </div>
      </div>
    </>
  )
}