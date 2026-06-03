import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Plus, Search, Tag, Trash2 } from "lucide-react";

export const GetMyCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("expense");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getAllCategories = async () => {
    try {
      const res = await axios.get("/expCat/userCategory");
      setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load expense categories");
    } finally {
      setLoading(false);
    }
  };

  const getAllIncomeCategories = async () => {
    try {
      const res = await axios.get("/incomeCat/incomeCategory");
      setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load income categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (selectedCategory === "expense") {
      getAllCategories();
    } else {
      getAllIncomeCategories();
    }
  }, [selectedCategory]);

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      if (selectedCategory === "expense") {
        await axios.delete(`/expCat/deletecat/${id}`);
      } else {
        await axios.delete(`/incomeCat/deleteincomecat/${id}`);
      }

      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const filteredCategories = categories.filter((category) =>
    `${category.catName || ""} ${category.description || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrap space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="pill">
            <FolderKanban size={15} />
            {categories.length} categories
          </span>
          <h1 className="section-title mt-4">Categories</h1>
          <p className="section-subtitle">Organize income and expenses into tidy groups.</p>
        </div>
        <button type="button" onClick={() => navigate("/add-category")} className="primary-btn">
          <Plus size={18} />
          Add Category
        </button>
      </section>

      <section className="app-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_14rem]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
              className="field-input pl-10"
            />
          </label>
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="field-input">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="app-card p-10 text-center font-bold text-slate-500">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="app-card p-10 text-center">
          <Tag className="mx-auto text-slate-400" size={42} />
          <h2 className="mt-4 text-xl font-black text-slate-950">No categories found</h2>
          <p className="mt-2 text-slate-500">Create your first category to keep records clean.</p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <article key={category._id} className="app-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                    <Tag size={20} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black text-slate-950">{category.catName}</h2>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{selectedCategory}</p>
                  </div>
                </div>
                <button type="button" onClick={() => deleteCategory(category._id)} className="icon-btn danger-btn" aria-label="Delete category">
                  <Trash2 size={17} />
                </button>
              </div>
              <p className="mt-4 line-clamp-3 min-h-12 text-sm text-slate-500">{category.description || "No description added."}</p>
              <div className="mt-5 border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">ID: {category._id?.slice(-8)}</div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};
