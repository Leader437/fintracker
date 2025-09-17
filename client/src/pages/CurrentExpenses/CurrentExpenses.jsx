import { useState, useMemo } from "react";
import { Button, Heading, Input, ShowExpense, Select } from "../../components";
import { IoSearch } from "react-icons/io5";
import { useFormat } from "../../hooks";
import { useSelector } from "react-redux";

const CurrentExpenses = () => {
  const expenses = useSelector((state) => state.expense.expenses);

  const currency = "Rs";

  const [query, setQuery] = useState("");

  // category filter state
  const [category, setCategory] = useState("All");

  // derive unique category options (includes "All")
  const categories = useMemo(() => {
    const setCats = new Set(expenses.map((e) => e.category).filter(Boolean));    // creating set of array to keep only unique values of array, using filter(Boolean) to keep only truthy values and avoid the cases with empty category value or empty strings, null, undefined e.t.c
    return ["All", ...Array.from(setCats)];      // converting set back to array and adding "All" option at the start
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

  const totalAmount = filteredExpenses.reduce((sum, exp) => {
    return sum + exp.amount;
  }, 0);

  // format expenses to display using custom hook
  const formattedExpenses = useFormat(filteredExpenses);

  return (
    <>
      <div className="flex items-baseline justify-between gap-4 pr-1 mb-2">
        <Heading className="text-xl sm:text-2xl">
          Current Expenses
        </Heading>
        <p className="relative text-xl md:text-3xl font-display top-1 md:top-2">
            {totalAmount}{" "}
            {currency}
        </p>
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
          <div className="fixed right-2 bottom-18 md:static">
            <Button size="xs">+ Add Expense</Button>
          </div>
        </div>
      </div>
      <ShowExpense expenses={formattedExpenses} currency={currency} />
    </>
  );
};

export default CurrentExpenses;
