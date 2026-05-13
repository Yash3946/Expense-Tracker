import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

import { Bar } from 'react-chartjs-2'

ChartJS.register(
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
)

export const Report1 = () => {

  const [barData, setBarData] = useState({
    labels: [],
    datasets: []
  })

  const [isLoading, setIsLoading] = useState(true)

  const getMyExpenses = async () => {

    try {

      const res = await axiosInstance.get(`/exp/expbyuserid`)

      console.log(res.data.data)

      if (res.data && Array.isArray(res.data.data)) {

        const paymentData = {
          CASH: 0,
          CARD: 0,
          UPI: 0,
          CHEQUE: 0
        }

        res.data.data.map((exp) => {

          const paymentMode = exp.paymentMode
          const amount = Number(exp.amount)

          if (paymentData[paymentMode] !== undefined) {

            paymentData[paymentMode] += amount
          }
        })

        console.log(paymentData)

        const chartData = {

          labels: Object.keys(paymentData),

          datasets: [
            {
              label: "Payment Mode Amount",

              data: Object.values(paymentData),

              backgroundColor: [
                'rgba(251,191,36,0.7)',
                'rgba(59,130,246,0.7)',
                'rgba(168,85,247,0.7)',
                'rgba(239,68,68,0.7)',
              ],

              borderColor: [
                'rgba(251,191,36,1)',
                'rgba(59,130,246,1)',
                'rgba(168,85,247,1)',
                'rgba(239,68,68,1)',
              ],

              borderWidth: 2,
              borderRadius: 12,
              barThickness: 60,
            }
          ]
        }

        setBarData(chartData)
      }

    } catch (err) {

      console.error("Error fetching expenses", err)

    } finally {

      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMyExpenses()
  }, [])

  return (

    <div
      className="min-h-screen px-4 py-10 text-white"
      style={{
        background:
          'linear-gradient(135deg,#020617,#0f172a,#111827)'
      }}
    >

      <div className="max-w-6xl mx-auto">

        {/* HEADING */}
        <div className="text-center mb-12">

          <h1 className="text-4xl font-bold mb-3">
            Payment Mode <span className="text-indigo-400">Report</span>
          </h1>

          <p className="text-slate-400">
            Expense analysis based on payment modes 📊
          </p>

        </div>

        {/* CARD */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(15,23,42,0.75)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)'
          }}
        >

          {isLoading ? (

            <div className="text-center text-slate-400 py-20">
              Loading Report...
            </div>

          ) : (

            <div className="w-full">

              <Bar
                data={barData}
                options={{
                  responsive: true,

                  plugins: {

                    legend: {
                      labels: {
                        color: 'white'
                      }
                    }
                  },

                  scales: {

                    x: {

                      ticks: {
                        color: 'white',
                        font: {
                          size: 14
                        }
                      },

                      grid: {
                        color: 'rgba(255,255,255,0.08)'
                      }
                    },

                    y: {

                      beginAtZero: true,

                      ticks: {
                        color: 'white',
                        font: {
                          size: 14
                        }
                      },

                      grid: {
                        color: 'rgba(255,255,255,0.08)'
                      }
                    }
                  }
                }}
              />

            </div>
          )}

        </div>

      </div>

    </div>
  )
}