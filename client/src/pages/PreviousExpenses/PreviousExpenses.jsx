import { useState, useMemo } from "react";
import {
  Heading,
  Select,
  Input,
  Button,
  ShowMonths,
  CompareExpenses,
} from "../../components";
import { useSelector } from "react-redux";
import { useFormat, useCurrentMonthYear } from "../../hooks";
import { IoIosGitCompare } from "react-icons/io";
import { GoHistory } from "react-icons/go";

const PreviousExpenses = () => {
  const currency = "Rs";
  const expenses = useSelector((state) => state.expense.expenses);
  const [contentType, setContentType] = useState("show");
  const [query, setQuery] = useState("");

  const { label } = useCurrentMonthYear();

  // category filter state
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const setCats = new Set(expenses.map((e) => e.category).filter(Boolean)); // creating set of array to keep only unique values of array, using filter(Boolean) to keep only truthy values and avoid the cases with empty category value or empty strings, null, undefined e.t.c
    return ["All", ...Array.from(setCats)]; // converting set back to array and adding "All" option at the start
  }, [expenses]);

  // filtering expenses based on search query
  const searchedExpenses = useMemo(() => {
    if (!query) return expenses;
    const q = query.trim().toLowerCase();
    return expenses.filter(
      (e) =>
        (e.name || "").toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q)
    );
  }, [expenses, query]);

  // apply category filter after search
  const filteredExpenses = useMemo(() => {
    if (!category || category === "All") return searchedExpenses;
    return searchedExpenses.filter((e) => e.category === category);
  }, [searchedExpenses, category]);

  // format expenses to display using custom hook
  const formattedExpenses = useFormat(filteredExpenses);

  const formatMonthExpenses = formattedExpenses.reduce((acc, expense) => {
    const [month, day, year] = expense.date.split(" ");

    if (!acc[`${month} ${year}`]) {
      acc[`${month} ${year}`] = [];
    }

    acc[`${month} ${year}`].push(expense);
    return acc;
  }, {});

  return (
    <>
      <div className="flex items-baseline justify-between gap-4 pr-1 mb-2">
        <Heading className="text-xl sm:text-2xl">Previous Expenses</Heading>
      </div>
      <div className="w-full mb-3 border-b border-[rgba(128,128,128,0.3)]"></div>
      <div className="flex flex-row-reverse items-baseline justify-between gap-3 mb-12 md:flex-row">
        <div className="relative min-w-fit flex items-center gap-4 bottom-[3px]">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="sm"
            options={categories}
          />
        </div>
        <div className="flex items-center w-full gap-2 md:ml-auto md:w-auto">
          <form
            action=""
            className="flex items-center w-full gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <div className="fixed z-10 right-2 bottom-18 md:static">
            {contentType === "show" && (
              <Button size="xs" onClick={() => setContentType("compare")}>
                <IoIosGitCompare /> Compare
              </Button>
            )}
            {contentType === "compare" && (
              <Button size="xs" onClick={() => setContentType("show")}>
                <GoHistory /> All History
              </Button>
            )}
          </div>
        </div>
      </div>
      {contentType === "show" && (
        <div className="flex flex-col w-full gap-2">
          {Object.keys(formatMonthExpenses).map((month) => {
            const total = formatMonthExpenses[month].reduce(
              (sum, exp) => sum + exp.total,
              0
            );

            return label !== month ? (
              <ShowMonths
                expenses={formatMonthExpenses[month]}
                month={month}
                total={total}
                currency={currency}
              />
            ) : null;
          })}
        </div>
      )}
      {contentType === "compare" && (
        <CompareExpenses
          expenses={formattedExpenses}
        />
      )}
    </>
  );
};

export default PreviousExpenses;
