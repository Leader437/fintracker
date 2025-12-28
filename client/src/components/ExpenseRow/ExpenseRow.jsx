import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../../features/expense/expenseSlice";
import { useState } from "react";
import { ConfirmModal, EditExpenseModal } from "../index";

const ExpenseRow = ({ expense, currency }) => {
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
    <>
      <p className="text-sm break-words text-detail">{expense.name}</p>
      <p className="text-sm text-detail">{expense.amount} {currency}</p>
      <div className="text-sm text-detail">
        {expense.description ? (
          expense.description.split(" ").length <= 3 ? (
            <span className="block mx-auto">{expense.description}</span>
          ) : (
            <details>
              <summary
                className="list-none cursor-pointer"
                style={{ outline: "none" }}
              >
                {expense.description.split(" ").slice(0, 3).join(" ") + "..."}
              </summary>
              <p className="mt-1 text-sm">{expense.description}</p>
            </details>
          )
        ) : (
          <span className="block mx-auto">-</span>
        )}
      </div>
      <p className="text-sm text-detail">{expense.category}</p>
      <p
        className={`text-sm ${
          expense.priority === "high"
            ? "text-red-500"
            : expense.priority === "medium"
            ? "text-green-500"
            : "text-yellow-500"
        }`}
      >
        {expense.priority}
      </p>
      <div className="flex gap-3">
        <button className="text-base text-detail" onClick={handleEdit}>
          <FiEdit />
        </button>
          <EditExpenseModal open={showEdit} onClose={handleCloseEdit} expense={expense} />
        <button className="text-lg text-detail" onClick={handleDelete}>
          <MdDelete />
        </button>
      </div>
      <ConfirmModal
        open={showConfirm}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ExpenseRow;
