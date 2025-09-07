import { useState, useMemo } from "react";
import { Button, Heading, Input, ShowExpense, Select } from "../../components";
import { IoSearch } from "react-icons/io5";
import { useFormat } from "../../hooks";

const expenses = [
  {
    id: 1,
    name: "rent",
    description: "Monthly house rent payment for October.",
    amount: 370,
    priority: "high",
    category: "rent",
    date: "2023-10-10",
  },
  {
    id: 2,
    name: "electricity bill",
    description: "October electricity bill for apartment.",
    amount: 120,
    priority: "medium",
    category: "utilities",
    date: "2023-10-10",
  },
  {
    id: 3,
    name: "groceries",
    description:
      "Bought groceries from supermarket including fruits and vegetables.",
    amount: 90,
    priority: "high",
    category: "food",
    date: "2023-10-11",
  },
  {
    id: 4,
    name: "internet",
    description: "Broadband bill for the month of October.",
    amount: 40,
    priority: "medium",
    category: "utilities",
    date: "2023-10-11",
  },
  {
    id: 5,
    name: "safai ky paisay",
    description: "",
    amount: 50,
    priority: "low",
    category: "maintenance",
    date: "2023-11-10",
  },
  {
    id: 6,
    name: "fuel",
    description: "Petrol refilling.",
    amount: 65,
    priority: "medium",
    category: "transport",
    date: "2023-11-10",
  },
  {
    id: 7,
    name: "dinner",
    description: "Dinner with friends at local restaurant.",
    amount: 45,
    priority: "low",
    category: "food",
    date: "2023-11-11",
  },
  {
    id: 8,
    name: "gym membership",
    description: "Monthly gym subscription fee.",
    amount: 30,
    priority: "medium",
    category: "health",
    date: "2023-11-11",
  },
  {
    id: 9,
    name: "shopping",
    description: "Bought clothes and shoes.",
    amount: 150,
    priority: "low",
    category: "shopping",
    date: "2023-11-12",
  },
  {
    id: 10,
    name: "water bill",
    description: "",
    amount: 25,
    priority: "medium",
    category: "utilities",
    date: "2023-11-12",
  },
];

const CurrentExpenses = () => {
  const currency = "Rs";

  const [query, setQuery] = useState("");

  // category filter state
  const [category, setCategory] = useState("All");

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

  const totalAmount = filteredExpenses.reduce((sum, exp) => {
    return sum + exp.amount;
  }, 0);

  // format expenses to display using custom hook
  const formattedExpenses = useFormat(filteredExpenses);

  return (
    <>
      <div className="flex items-baseline justify-between gap-4 pr-1 mb-2">
        <Heading size="4xl">
          Current Expenses
        </Heading>
        <p className="relative text-2xl md:text-3xl font-display top-1 md:top-2">
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
