import { useState } from "react";
import ShowExpense from "../ShowExpense/ShowExpense";
import { BsChevronRight } from "react-icons/bs";
import "./ShowMonths.css";

const ShowMonths = ({expenses, month, total, currency}) => {
    const [open, setOpen] = useState(false);

    if (!Array.isArray(expenses) || expenses.length === 0) {
        return (
            <div className="w-full">
                <div className="bg-white shadow w-full flex items-center justify-between cursor-pointer px-6 py-4 rounded-lg">
                    <div className="flex flex-col">
                        <span className="text-lg font-display font-semibold">{month}</span>
                        <span className="text-sm font-display text-detail font-normal">No expenses for this month.</span>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full">
            <div
                className={`bg-white shadow w-full flex items-center justify-between cursor-pointer px-6 py-4 ${open ? "rounded-t-lg" : "rounded-lg"}`}
                onClick={() => setOpen((prev) => !prev)}
                style={{ userSelect: "none" }}
            >
                <div className="flex flex-col">
                <span className="text-lg font-display font-semibold">{month}</span>
                <span className="text-sm font-display text-detail font-normal">({total} {currency} spent)</span>
                </div>
                <span
                    className="chevron text-primary text-lg"
                    style={{
                        display: "inline-block",
                        transform: open ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                    aria-label={open ? "Collapse" : "Expand"}
                >
                    <BsChevronRight />
                </span>
            </div>
            {open && (
                <div className="dropdown-content bg-white rounded-b-lg border-t border-t-gray-300 shadow px-4 pt-8 pb-1">
                    <ShowExpense expenses={expenses} currency={currency} />
                </div>
            )}
        </div>
    );
};

export default ShowMonths;