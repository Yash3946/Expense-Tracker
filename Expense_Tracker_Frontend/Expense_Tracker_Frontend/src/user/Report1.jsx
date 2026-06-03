import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { BarChart3, CreditCard } from "lucide-react";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const Report1 = () => {
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);

  const getMyExpenses = async () => {
    try {
      const res = await axiosInstance.get("/exp/expbyuserid");
      if (res.data && Array.isArray(res.data.data)) {
        const paymentData = { CASH: 0, CARD: 0, UPI: 0, CHEQUE: 0 };

        res.data.data.forEach((exp) => {
          const paymentMode = exp.paymentMode;
          const amount = Number(exp.amount || 0);
          if (paymentData[paymentMode] !== undefined) {
            paymentData[paymentMode] += amount;
          }
        });

        setBarData({
          labels: Object.keys(paymentData),
          datasets: [
            {
              label: "Payment Mode Amount",
              data: Object.values(paymentData),
              backgroundColor: ["#f59e0b", "#0891b2", "#16a34a", "#ef4444"],
              borderRadius: 8,
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

  const total = useMemo(() => barData.datasets?.[0]?.data?.reduce((sum, value) => sum + Number(value || 0), 0) || 0, [barData]);

  return (
    <div className="page-wrap space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="pill">
            <BarChart3 size={15} />
            Payment analysis
          </span>
          <h1 className="section-title mt-4">Payment Mode Report</h1>
          <p className="section-subtitle">Compare spending across cash, card, UPI, and cheque.</p>
        </div>
        <div className="app-card px-5 py-4">
          <p className="text-sm font-bold text-slate-500">Tracked Spend</p>
          <p className="text-2xl font-black text-slate-950">
            {total.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
          </p>
        </div>
      </section>

      <section className="app-card p-5 sm:p-8">
        {isLoading ? (
          <div className="py-20 text-center font-bold text-slate-500">Loading report...</div>
        ) : total === 0 ? (
          <div className="py-20 text-center">
            <CreditCard className="mx-auto text-slate-400" size={42} />
            <h2 className="mt-4 text-xl font-black text-slate-950">No payment data</h2>
            <p className="mt-2 text-slate-500">Add expenses with payment modes to generate analytics.</p>
          </div>
        ) : (
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: "#334155", font: { weight: "bold" } },
                },
              },
              scales: {
                x: {
                  ticks: { color: "#475569", font: { weight: "bold" } },
                  grid: { color: "rgba(15, 23, 42, 0.06)" },
                },
                y: {
                  beginAtZero: true,
                  ticks: { color: "#475569", font: { weight: "bold" } },
                  grid: { color: "rgba(15, 23, 42, 0.08)" },
                },
              },
            }}
          />
        )}
      </section>
    </div>
  );
};
