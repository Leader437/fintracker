
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { deleteExpense } from "../../features/expense/expenseSlice";
import { ConfirmModal, EditExpenseModal } from "../index";

const ExpenseCard = ({ expense, currency }) => {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };
  const handleConfirmDelete = () => {
    dispatch(deleteExpense(expense._id));
    setShowConfirm(false);
  };
  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const handleEdit = () => {
    setShowEdit(true);
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  return (
    <div>
      <div className="grid gap-4 md:hidden">
        <div key={expense._id || expense.id} className="p-3 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-2xl font-medium text-display">
              {expense.amount} {currency}
            </h5>
            <div className="flex gap-3">
              <button className="text-xl text-detail" onClick={handleEdit}>
                <FiEdit />
              </button>
              <button className="text-2xl text-detail" onClick={handleDelete}>
                <MdDelete />
              </button>
            </div>
          </div>
          <p className="text-detail">
            <span className="font-semibold text-primary">Name:</span> {expense.name}
          </p>
          <p className="text-detail">
            <span className="font-semibold text-primary">Category:</span> {expense.category}
          </p>
          <p className="text-detail">
            <span className="font-semibold text-primary">Priority:</span> <span
              className={
                expense.priority === "high"
                  ? "text-red-500"
                  : expense.priority === "medium"
                  ? "text-green-500"
                  : "text-yellow-500"
              }
            >
              {expense.priority}
            </span>
          </p>
          {expense.description && (
            <p className="text-detail">
              <span className="font-semibold text-primary">Description:</span> {expense.description}
            </p>
          )}
          <EditExpenseModal open={showEdit} onClose={handleCloseEdit} expense={expense} />
          <ConfirmModal
            open={showConfirm}
            title="Delete Expense"
            message="Are you sure you want to delete this expense? This action cannot be undone."
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
