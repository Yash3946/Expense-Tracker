import React from "react";
import { useForm } from "react-hook-form";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, FolderPlus, ListChecks, Save, Tag } from "lucide-react";

export const AddCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      if (data.type === "expense") {
        await axios.post("/expCat/", data);
        toast.success("Expense category added");
      }

      if (data.type === "income") {
        await axios.post("/incomeCat/", data);
        toast.success("Income category added");
      }

      reset();
      navigate("/my-categories");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="page-wrap">
      <button type="button" onClick={() => navigate("/my-categories")} className="secondary-btn mb-6">
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="app-card p-6 sm:p-8">
          <span className="pill">
            <FolderPlus size={15} />
            New category
          </span>
          <h1 className="section-title mt-5">Create a better label for your money.</h1>
          <p className="section-subtitle">
            Keep spending and income grouped neatly so reports stay readable.
          </p>

          <div className="mt-8 space-y-4">
            {["Use short category names", "Add a useful description", "Separate income and expense labels"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <ListChecks className="text-cyan-700" size={18} />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="app-card p-6 sm:p-8">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div>
              <label className="field-label" htmlFor="type">
                <Tag size={16} />
                Category Type
              </label>
              <select
                id="type"
                {...register("type", {
                  required: "Please select category type",
                })}
                className="field-input"
              >
                <option value="">Select type</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              {errors.type && <p className="mt-2 text-sm font-bold text-rose-600">{errors.type.message}</p>}
            </div>

            <div>
              <label className="field-label" htmlFor="catName">
                <FolderPlus size={16} />
                Category Name
              </label>
              <input
                id="catName"
                type="text"
                placeholder="Food, salary, travel..."
                {...register("catName", {
                  required: "Category name is required",
                })}
                className="field-input"
              />
              {errors.catName && <p className="mt-2 text-sm font-bold text-rose-600">{errors.catName.message}</p>}
            </div>

            <div>
              <label className="field-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="What should this category include?"
                {...register("description")}
                className="field-input resize-none"
              />
            </div>

            <button type="submit" className="primary-btn w-full">
              <Save size={18} />
              Save Category
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
