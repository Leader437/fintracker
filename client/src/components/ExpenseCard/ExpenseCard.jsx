import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const ExpenseCard = ({ expense, currency }) => {
  return (
    <div>
      <div className="grid gap-4 md:hidden">
        <div key={expense.id} className="p-3 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-2xl font-medium text-display">
              {expense.amount}{currency}
            </h5>
            <div className="flex gap-3">
              <button className="text-base text-detail">
                <FiEdit />
              </button>
              <button className="text-lg text-detail">
                <MdDelete />
              </button>
            </div>
          </div>
          <p className="text-detail">
            <span className="font-semibold text-primary">Name:</span>{" "}
            {expense.name}
          </p>
          <p className="text-detail">
            <span className="font-semibold text-primary">Category:</span>{" "}
            {expense.category}
          </p>
          <p className="text-detail">
            <span className="font-semibold text-primary">Priority:</span>{" "}
            <span
              className={`${
                expense.priority === "high"
                  ? "text-red-500"
                  : expense.priority === "medium"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {expense.priority}
            </span>
          </p>
          {expense.description && (
            <p className="text-detail">
              <span className="font-semibold text-primary">Description:</span>{" "}
              {expense.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
