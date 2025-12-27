import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../../features/expense/expenseSlice";

const ExpenseCard = ({ expense, currency }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteExpense(expense._id));
    }
  };

  // Edit handler can be implemented as needed

  return (
    <div>
      <div className="grid gap-4 md:hidden">
        <div key={expense._id || expense.id} className="p-3 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-2xl font-medium text-display">
              {expense.amount} {currency}
            </h5>
            <div className="flex gap-3">
              <button className="text-xl text-detail" disabled>
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
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
