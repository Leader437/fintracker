import { Button, Heading, Input, ShowExpense } from "../../components";
import { IoSearch } from "react-icons/io5";

const CurrentExpenses = () => {
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

  return (
    <>
      <Heading size="4xl">Current Expenses</Heading>
      <p className="mt-2 mb-1 text-sm text-detail">
        Here you can view and manage your current month expenses.
      </p>
      <div className="w-full mb-3 border-b border-[rgba(128,128,128,0.3)]"></div>
      <div className="flex flex-col items-baseline justify-between gap-3 mb-12 md:flex-row">
        <p className="text-sm font-display">
          <span className="text-2xl">4800$</span> (
          <span className="text-accent">*</span>300 already spent)
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <form action="" className="flex items-center">
            <Input label="Search" />
            <Button size="xs">
              <IoSearch />
            </Button>
          </form>
          <Button size="xs">+ Add Expense</Button>
        </div>
      </div>
      <ShowExpense expenses={expenses} />
    </>
  );
};

export default CurrentExpenses;
