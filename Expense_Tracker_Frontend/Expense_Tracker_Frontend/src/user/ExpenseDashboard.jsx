import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  FolderKanban,
  Plus,
  ReceiptText,
  WalletCards,
} from "lucide-react";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

export const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const [expenseRes, incomeRes] = await Promise.all([
          axiosInstance.get("/exp/expbyuserid?type=expense"),
          axiosInstance.get("/exp/expbyuserid?type=income"),
        ]);

        setExpenses(Array.isArray(expenseRes.data?.data) ? expenseRes.data.data : []);
        setIncome(Array.isArray(incomeRes.data?.data) ? incomeRes.data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  const summary = useMemo(() => {
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalIncome = income.reduce((sum, item) => sum + Number(item.income || 0), 0);
    const recent = [...expenses, ...income]
      .sort((a, b) => new Date(b.expenseDate || b.createdAt) - new Date(a.expenseDate || a.createdAt))
      .slice(0, 5);

    return {
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      recordCount: expenses.length + income.length,
      recent,
    };
  }, [expenses, income]);

  const stats = [
    {
      label: "Total Income",
      value: formatMoney(summary.totalIncome),
      icon: ArrowUpRight,
      tone: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
    },
    {
      label: "Total Expense",
      value: formatMoney(summary.totalExpense),
      icon: ArrowDownRight,
      tone: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40",
    },
    {
      label: "Net Balance",
      value: formatMoney(summary.balance),
      icon: WalletCards,
      tone: "text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950/40",
    },
    {
      label: "Records",
      value: summary.recordCount,
      icon: ReceiptText,
      tone: "text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-800/40",
    },
  ];

  return (
    <div className="page-wrap space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="app-card overflow-hidden">
          <div className="grid min-h-[280px] gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_18rem]">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <span className="pill">
                  <CircleDollarSign size={15} />
                  Finance overview
                </span>
                <h1 className="section-title mt-5">Track every rupee with a sharper dashboard.</h1>
                <p className="section-subtitle">
                  Income, expenses, categories, budgets, and reports now live in one clean workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/add-expense" className="primary-btn">
                  <Plus size={18} />
                  Add Record
                </Link>
                <Link to="/my-expenses" className="secondary-btn">
                  <ReceiptText size={18} />
                  View Records
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 p-5 text-white">
              <p className="text-sm font-bold text-slate-300">Available Balance</p>
              <p className="mt-3 text-4xl font-black">{formatMoney(summary.balance)}</p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400">Income</span>
                  <span className="font-bold text-emerald-300">{formatMoney(summary.totalIncome)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Expense</span>
                  <span className="font-bold text-rose-300">{formatMoney(summary.totalExpense)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="app-card p-6">
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Quick Actions</h2>
          <div className="mt-5 grid gap-3">
            <Link to="/add-category" className="secondary-btn justify-start">
              <FolderKanban size={18} />
              Create category
            </Link>
            <Link to="/budget" className="secondary-btn justify-start">
              <WalletCards size={18} />
              Manage budget
            </Link>
            <Link to="/reports" className="secondary-btn justify-start">
              <CircleDollarSign size={18} />
              Category report
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.tone}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="app-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-5">
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-500">Latest income and expense entries.</p>
          </div>
          <Link to="/my-expenses" className="secondary-btn">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center font-bold text-slate-500">Loading dashboard...</div>
        ) : summary.recent.length === 0 ? (
          <div className="p-8 text-center font-bold text-slate-500">No records yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {summary.recent.map((record) => {
                  const isIncome = record.income !== undefined && record.income !== null;
                  return (
                    <tr key={record._id}>
                      <td className="font-black text-slate-950 dark:text-white">{record.title}</td>
                      <td>{isIncome ? record.incomeCategory?.catName || "Income" : record.expCat?.catName || "Expense"}</td>
                      <td>
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={15} />
                          {record.expenseDate ? new Date(record.expenseDate).toLocaleDateString("en-IN") : "No date"}
                        </span>
                      </td>
                      <td className={isIncome ? "font-black text-emerald-700 dark:text-emerald-400" : "font-black text-rose-700 dark:text-rose-400"}>
                        {isIncome ? "+" : "-"}
                        {formatMoney(isIncome ? record.income : record.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
