import { useState, useMemo, useEffect, useCallback } from "react";
import { Button, Heading, Input, ShowExpense, Select, AddForm } from "../../components";
import { useFormat, useCurrentMonthYear } from "../../hooks";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenses, addExpense, deleteExpense, updateExpense } from "../../features/expense/expenseSlice";


const CurrentExpenses = () => {
  const dispatch = useDispatch();
  const { month, year } = useCurrentMonthYear();
  const expenses = useSelector((state) => state.expense.expenses);
  const loading = useSelector((state) => state.expense.loading);
  const error = useSelector((state) => state.expense.error);
  const currency = "Rs";
  const [query, setQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // derive unique category options (includes "All")
  const categories = useMemo(() => {
    const setCats = new Set(expenses.map((e) => e.category).filter(Boolean));
    return ["All", ...Array.from(setCats)];
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
  const CurrentExpenses = formattedExpenses.filter(expense => expense.date.includes(month) && expense.date.includes(year));
  const totalAmount = CurrentExpenses.reduce((sum, exp) => sum + exp.total, 0);

  // Add expense handler
  const handleAddExpense = useCallback(async (expense, onSuccess, onError) => {
    try {
      await dispatch(addExpense(expense)).unwrap();
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
    }
  }, [dispatch]);

  return (
    <>
      <div className="flex items-baseline justify-between gap-4 pr-1 mb-2">
        <Heading className="text-xl sm:text-2xl">Current Expenses</Heading>
        <p className="relative text-xl md:text-3xl font-display top-1 md:top-2">
          {totalAmount} {currency}
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
          <div className="fixed z-10 right-2 bottom-18 md:static">
            <Button size="xs" onClick={() => setShowAddForm(true)}>
              + Add Expense
            </Button>
          </div>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <ShowExpense expenses={CurrentExpenses} currency={currency} />
      <AddForm 
        open={showAddForm} 
        onClose={() => setShowAddForm(false)} 
        onAddExpense={handleAddExpense}
      />
    </>
  );
};

export default CurrentExpenses;
