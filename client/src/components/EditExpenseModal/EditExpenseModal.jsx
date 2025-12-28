import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateExpense } from "../../features/expense/expenseSlice";
import { selectGlobalCategories } from "../../features/expense/expenseSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Button } from "../index";

const EditExpenseModal = ({ open, onClose, expense }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectGlobalCategories);
  const priorities = ["low", "medium", "high"];
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      expenseName: expense?.name || "",
      expenseAmount: expense?.amount || "",
      expenseDescription: expense?.description || "",
      expenseCategory: expense?.category || "",
      expensePriority: expense?.priority || "Medium",
      expenseDate: expense?.date || new Date().toISOString().split("T")[0],
    },
  });
  useEffect(() => {
    if (open) {
      reset({
        expenseName: expense?.name || "",
        expenseAmount: expense?.amount || "",
        expenseDescription: expense?.description || "",
        expenseCategory: expense?.category || "",
        expensePriority: expense?.priority || "Medium",
        expenseDate: expense?.date || new Date().toISOString().split("T")[0],
      });
    }
  }, [open, expense, reset]);

  const onSubmit = async (data) => {
    try {
      // Map fields to backend expected names
      const payload = {
        id: expense.id || expense._id,
        expenseName: data.expenseName,
        expenseCategory: data.expenseCategory,
        expenseDescription: data.expenseDescription,
        expenseDate: data.expenseDate,
        expenseAmount: data.expenseAmount,
        expensePriority: data.expensePriority,
      };
      await dispatch(updateExpense(payload)).unwrap();
      toast.success("Expense updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to update expense");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-3 sm:p-6 max-h-[95vh] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Edit expense form" onClick={e => e.stopPropagation()}>
        <button className="absolute text-xl text-gray-400 sm:text-2xl top-2 right-3 sm:top-3 sm:right-4 hover:text-gray-700" onClick={onClose} aria-label="Close">×</button>
        <div className="pr-8 mb-4 sm:mb-6">
          <h3 className="mb-2 text-xl sm:text-2xl font-semibold">Edit Expense</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">Expense Name</label>
              <input
                {...register("expenseName", { required: "Name is required" })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.expenseName && <p className="mt-1 text-sm text-red-600">{errors.expenseName.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Amount</label>
              <input
                type="number"
                step="01"
                {...register("expenseAmount", { required: "Amount is required", min: { value: 1, message: "Amount must be greater than 0" } })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.expenseAmount && <p className="mt-1 text-sm text-red-600">{errors.expenseAmount.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-sm font-medium">Description</label>
              <input
                {...register("expenseDescription", { required: "Description is required" })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.expenseDescription && <p className="mt-1 text-sm text-red-600">{errors.expenseDescription.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Category</label>
              <select
                {...register("expenseCategory", { required: "Category is required" })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.expenseCategory && <p className="mt-1 text-sm text-red-600">{errors.expenseCategory.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Priority</label>
              <select
                {...register("expensePriority", { required: "Priority is required" })}
                className="w-full px-3 py-2 border rounded"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
              {errors.expensePriority && <p className="mt-1 text-sm text-red-600">{errors.expensePriority.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Date</label>
              <input
                type="date"
                {...register("expenseDate", { required: "Date is required" })}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.expenseDate && <p className="mt-1 text-sm text-red-600">{errors.expenseDate.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" size="sm" category="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
