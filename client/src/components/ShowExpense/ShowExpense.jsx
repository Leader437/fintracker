import ExpenseCard from "../ExpenseCard/ExpenseCard";
import ExpenseRow from "../ExpenseRow/ExpenseRow";
import "./ShowExpense.css";

const ShowExpense = ({expenses, currency}) => {

  return (
    <div>
      <ul>
        {expenses.map((group) => (
          <li key={group.date} className="mb-14">
            <div className="flex items-center justify-between gap-2 mt-2">
              <p className="px-1 font-semibold text-detail font-display whitespace-nowrap">
                {group.date}
              </p>
              <p className="px-1 font-semibold text-detail font-display whitespace-nowrap">
                {group.total}{" "}
                {currency} Total
              </p>
            </div>
            <div className="bg-detail h-[1px] w-full mb-2"></div>

            <div className="mb-2 expense-grid">
              <h4 className="text-base font-bold text-left font-display text-primary">
                Name
              </h4>
              <h4 className="text-base font-bold text-left font-display text-primary">
                Amount
              </h4>
              <h4 className="text-base font-bold text-left font-display text-primary">
                Description
              </h4>
              <h4 className="text-base font-bold text-left font-display text-primary">
                Category
              </h4>
              <h4 className="text-base font-bold text-left font-display text-primary">
                Priority
              </h4>
              <h4 className="text-base font-bold text-left font-display text-primary">
                Action
              </h4>
            </div>
            {/* data row - use paragraphs for text content */}
            <ul>
              {group.items.map((expense) => (
                <li className="mb-1.5">
                  <div className="expense-grid">
                    <ExpenseRow expense={expense} currency={currency} />
                  </div>
                  <ExpenseCard expense={expense} currency={currency} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowExpense;
