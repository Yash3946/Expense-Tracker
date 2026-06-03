import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BadgeIndianRupee, CalendarDays, Pencil, Save, Trash2, Wallet } from "lucide-react";
import { toast } from "react-toastify";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    maxAmount: "",
    endDate: "",
    exceedDate: "",
    budgetStatus: "active",
  });

  const token = localStorage.getItem("token");

  const createBudget = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/budget",
        {
          maxAmount: formData.maxAmount,
          endDate: formData.endDate,
          exceedDate: formData.exceedDate,
          budgetStatus: formData.budgetStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      setFormData({ maxAmount: "", endDate: "", exceedDate: "", budgetStatus: "active" });
      getBudgets();
    } catch (err) {
      console.log(err);
      toast.error("Create failed");
    }
  };

  const getBudgets = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/budget/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Fetch failed");
    }
  }, [token]);

  const deleteBudget = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:3000/budget/deletebyid/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      getBudgets();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const updateBudget = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3000/budget/update",
        {
          maxAmount: formData.maxAmount,
          endDate: formData.endDate,
          exceedDate: formData.exceedDate,
          budgetStatus: formData.budgetStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      getBudgets();
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  const loadBudgetData = (budget) => {
    setFormData({
      maxAmount: budget.maxAmount,
      endDate: budget.endDate?.split("T")[0],
      exceedDate: budget.exceedDate?.split("T")[0],
      budgetStatus: budget.budgetStatus,
    });
  };

  useEffect(() => {
    getBudgets();
  }, [getBudgets]);

  const activeBudget = useMemo(() => budgets.find((budget) => budget.budgetStatus === "active"), [budgets]);

  return (
    <div className="page-wrap space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="pill">
            <Wallet size={15} />
            {budgets.length} budgets
          </span>
          <h1 className="section-title mt-4">Budget Management</h1>
          <p className="section-subtitle">Set limits, track status, and keep your month under control.</p>
        </div>
        <div className="app-card px-5 py-4">
          <p className="text-sm font-bold text-slate-500">Active Budget</p>
          <p className="text-2xl font-black text-cyan-800">{activeBudget ? formatMoney(activeBudget.maxAmount) : "None"}</p>
        </div>
      </section>

      <section className="app-card p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="field-label" htmlFor="maxAmount">
              <BadgeIndianRupee size={16} />
              Max Amount
            </label>
            <input
              id="maxAmount"
              type="number"
              placeholder="Budget amount"
              value={formData.maxAmount}
              onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="endDate">
              <CalendarDays size={16} />
              End Date
            </label>
            <input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="exceedDate">
              <CalendarDays size={16} />
              Exceed Date
            </label>
            <input
              id="exceedDate"
              type="date"
              value={formData.exceedDate}
              onChange={(e) => setFormData({ ...formData, exceedDate: e.target.value })}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="budgetStatus">
              Status
            </label>
            <select id="budgetStatus" value={formData.budgetStatus} onChange={(e) => setFormData({ ...formData, budgetStatus: e.target.value })} className="field-input">
              <option value="active">Active</option>
              <option value="not active">Not Active</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={createBudget} className="primary-btn">
            <Save size={18} />
            Create Budget
          </button>
          <button type="button" onClick={updateBudget} className="secondary-btn">
            <Pencil size={18} />
            Update Budget
          </button>
        </div>
      </section>

      {budgets.length === 0 ? (
        <section className="app-card p-10 text-center">
          <Wallet className="mx-auto text-slate-400" size={42} />
          <h2 className="mt-4 text-xl font-black text-slate-950">No budgets yet</h2>
          <p className="mt-2 text-slate-500">Create a budget to start tracking limits.</p>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => (
            <article key={budget._id} className="app-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-sm font-black text-cyan-800">
                    <Wallet size={18} />
                    Budget
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{formatMoney(budget.maxAmount)}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => loadBudgetData(budget)} className="icon-btn" aria-label="Edit budget">
                    <Pencil size={17} />
                  </button>
                  <button type="button" onClick={() => deleteBudget(budget._id)} className="icon-btn danger-btn" aria-label="Delete budget">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm font-bold text-slate-600">
                <div className="flex items-center justify-between gap-3">
                  <span>Status</span>
                  <span className={`pill ${budget.budgetStatus === "active" ? "text-emerald-700" : "text-rose-700"}`}>{budget.budgetStatus}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>End</span>
                  <span>{budget.endDate ? new Date(budget.endDate).toLocaleDateString("en-IN") : "No date"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Exceed</span>
                  <span>{budget.exceedDate ? new Date(budget.exceedDate).toLocaleDateString("en-IN") : "No date"}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Budget;
