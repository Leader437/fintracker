import { Button, Heading, Input, ShowExpense } from "../../components";
import { IoSearch } from "react-icons/io5";

const CurrentExpenses = () => {
  return (
    <>
      <Heading size="4xl">Current Expenses</Heading>
      <p className="mt-2 mb-1 text-sm text-detail">
        Here you can view and manage your current month expenses.
      </p>
      <div className="w-full mb-3 border-b border-[rgba(128,128,128,0.3)]"></div>
      <div className="flex items-baseline justify-between mb-5">
        <p className="text-sm font-display">
          <span className="text-2xl">4800$</span> (
          <span className="text-accent">*</span>300 already spent)
        </p>
        <div className="flex items-center gap-2">
          <form action="" className="flex items-center">
            <Input label="Search" />
            <Button size="xs">
              <IoSearch />
            </Button>
          </form>
          <Button size="xs">+ Add Expense</Button>
        </div>
      </div>
      <ShowExpense />
    </>
  );
};

export default CurrentExpenses;
