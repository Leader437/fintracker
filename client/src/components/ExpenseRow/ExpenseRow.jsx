import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../../features/expense/expenseSlice";

const ExpenseRow = ({ expense, currency }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteExpense(expense._id));
    }
  };

  // Edit handler can be implemented as needed

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
        <button className="text-base text-detail" disabled>
          <FiEdit />
        </button>
        <button className="text-lg text-detail" onClick={handleDelete}>
          <MdDelete />
        </button>
      </div>
    </>
  );
};

export default ExpenseRow;
