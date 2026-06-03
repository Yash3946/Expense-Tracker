import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { PieChart, ReceiptText } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Report = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

  const getMyExpenses = async () => {
    try {
      const res = await axiosInstance.get("/exp/expbyuserid");
      if (res.data && Array.isArray(res.data.data)) {
        const groupedData = {};

        res.data.data.forEach((exp) => {
          const category = exp.expCat?.catName || "No Category";
          const amount = Number(exp.amount || 0);
          groupedData[category] = (groupedData[category] || 0) + amount;
        });

        setData({
          labels: Object.keys(groupedData),
          datasets: [
            {
              label: "Expense Amount",
              data: Object.values(groupedData),
              backgroundColor: ["#0891b2", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#0f172a", "#14b8a6", "#f97316"],
              borderColor: "#ffffff",
              borderWidth: 3,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error fetching expenses", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyExpenses();
  }, []);

  const total = useMemo(() => data.datasets?.[0]?.data?.reduce((sum, value) => sum + Number(value || 0), 0) || 0, [data]);

  return (
    <div className="page-wrap space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="pill">
            <PieChart size={15} />
            Category analysis
          </span>
          <h1 className="section-title mt-4">Expense Report</h1>
          <p className="section-subtitle">Understand which categories are taking the biggest share.</p>
        </div>
        <div className="app-card px-5 py-4">
          <p className="text-sm font-bold text-slate-500">Total Spend</p>
          <p className="text-2xl font-black text-slate-950">
            {total.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
          </p>
        </div>
      </section>

      <section className="app-card p-5 sm:p-8">
        {isLoading ? (
          <div className="py-20 text-center font-bold text-slate-500">Loading report...</div>
        ) : data.labels.length === 0 ? (
          <div className="py-20 text-center">
            <ReceiptText className="mx-auto text-slate-400" size={42} />
            <h2 className="mt-4 text-xl font-black text-slate-950">No report data</h2>
            <p className="mt-2 text-slate-500">Add expenses to generate category analytics.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <Pie
              data={data}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#334155", font: { weight: "bold" }, padding: 18 },
                  },
                },
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
};
