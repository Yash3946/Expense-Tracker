import React, { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { ArrowDown, ArrowUp, CreditCard, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

export const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(1);
  const [dateSort, setDateSort] = useState(1);
  const [type, settype] = useState("expense");

  const getMyExpenses = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/exp/expbyuserid?sort=${sort}&date=${dateSort}&type=${type}`);
      setExpenses(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [dateSort, sort, type]);

  const searchHanlder = async (e) => {
    try {
      const res = await axiosInstance.get("/exp/search?expName=" + e.target.value);
      setExpenses(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Search failed");
    }
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/exp/delete/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    setLoading(true);
    getMyExpenses();
  }, [getMyExpenses]);

  const total = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(type === "expense" ? item.amount || 0 : item.income || 0), 0),
    [expenses, type]
  );

  return (
    <div className="page-wrap space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="pill">
            <CreditCard size={15} />
            {expenses.length} records
          </span>
          <h1 className="section-title mt-4">{type === "expense" ? "Expenses" : "Income"}</h1>
          <p className="section-subtitle">Search, sort, and maintain your financial records.</p>
        </div>
        <div className="app-card px-5 py-4">
          <p className="text-sm font-bold text-slate-500">Current Total</p>
          <p className={`text-2xl font-black ${type === "expense" ? "text-rose-700" : "text-emerald-700"}`}>{formatMoney(total)}</p>
        </div>
      </section>

      <section className="app-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by title" onChange={searchHanlder} className="field-input pl-10" />
          </label>
          <select onChange={(e) => settype(e.target.value)} value={type} className="field-input">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </section>

      <section className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[900px]">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>
                  <div className="flex items-center gap-2">
                    Amount
                    <button type="button" onClick={() => setSort(1)} className="icon-btn h-7 w-7" aria-label="Sort amount ascending">
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" onClick={() => setSort(-1)} className="icon-btn h-7 w-7" aria-label="Sort amount descending">
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </th>
                <th>
                  <div className="flex items-center gap-2">
                    Date
                    <button type="button" onClick={() => setDateSort(1)} className="icon-btn h-7 w-7" aria-label="Sort date ascending">
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" onClick={() => setDateSort(-1)} className="icon-btn h-7 w-7" aria-label="Sort date descending">
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </th>
                <th>Category</th>
                <th>Mode</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center font-bold text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center font-bold text-slate-500">
                    No records found
                  </td>
                </tr>
              ) : (
                expenses.map((ex) => (
                  <tr key={ex._id}>
                    <td className="font-black text-slate-950">{ex.title}</td>
                    <td className="max-w-xs truncate">{ex.description || "No description"}</td>
                    <td className={`font-black ${type === "expense" ? "text-rose-700" : "text-emerald-700"}`}>
                      {formatMoney(type === "expense" ? ex.amount : ex.income)}
                    </td>
                    <td>{ex.expenseDate ? new Date(ex.expenseDate).toLocaleDateString("en-IN") : "No date"}</td>
                    <td>
                      <span className="pill">
                        {type === "expense" ? ex.expCat?.catName || "Uncategorized" : ex.incomeCategory?.catName || "Uncategorized"}
                      </span>
                    </td>
                    <td>
                      <span className="pill">{ex.paymentMode || "None"}</span>
                    </td>
                    <td className="text-center">
                      <button type="button" onClick={() => deleteExpense(ex._id)} className="icon-btn danger-btn" aria-label="Delete record">
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
