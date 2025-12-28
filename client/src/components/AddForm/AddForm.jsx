import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../features/expense/expenseSlice";
import { selectGlobalCategories } from "../../features/expense/expenseSlice";
import { expenseAPI } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Select, Heading } from "../index";
import { IoAdd, IoClose, IoChevronDown } from "react-icons/io5";
import { BiTrash, BiEdit } from "react-icons/bi";

const AddForm = ({ open = false, onClose = () => {}, onAddExpense }) => {
  const categories = useSelector(selectGlobalCategories);
  const [editingIndex, setEditingIndex] = useState(0);
  const [categoryInputs, setCategoryInputs] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [validationMessage, setValidationMessage] = useState("");

  const priorities = ["low", "medium", "high"];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm({
    defaultValues: {
      expenses: [
        {
          expenseName: "",
          expenseAmount: "",
          expenseDescription: "",
          expenseCategory: "",
          expensePriority: "medium",
          expenseDate: new Date().toISOString().split("T")[0],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  const watchedExpenses = watch("expenses");

  const addExpenseEntry = async () => {
    // Clear any existing validation message
    setValidationMessage("");

    // Validate the current expense before adding a new one
    const currentExpenseValid = await trigger(`expenses.${editingIndex}`);

    if (!currentExpenseValid) {
      setValidationMessage(
        "Please complete all required fields before adding another expense."
      );
      return;
    }

    // Also check if expenseCategory is filled (since it's handled separately)
    const currentExpense = getValues(`expenses.${editingIndex}`);
    if (!currentExpense.expenseCategory) {
      setValidationMessage(
        "Please select a category before adding another expense."
      );
      await trigger(`expenses.${editingIndex}.expenseCategory`);
      return;
    }

    append({
      expenseName: "",
      expenseAmount: "",
      expenseDescription: "",
      expenseCategory: "",
      expensePriority: "medium",
      expenseDate: new Date().toISOString().split("T")[0],
    });
    setEditingIndex(fields.length);
  };

  const handleCategoryInputChange = (index, value) => {
    // Clear validation message when user starts typing
    setValidationMessage("");
    setCategoryInputs((prev) => ({ ...prev, [index]: value }));
    setValue(`expenses.${index}.expenseCategory`, value);
    setShowSuggestions((prev) => ({ ...prev, [index]: true }));
    // Clear category error when user starts typing
    if (errors.expenses?.[index]?.expenseCategory) {
      trigger(`expenses.${index}.expenseCategory`);
    }
  };

  const handleCategorySelect = (index, category) => {
    // Clear validation message when user selects
    setValidationMessage("");
    setCategoryInputs((prev) => ({ ...prev, [index]: category }));
    setValue(`expenses.${index}.expenseCategory`, category);
    setShowSuggestions((prev) => ({ ...prev, [index]: false }));
    // Clear category error when user selects
    if (errors.expenses?.[index]?.expenseCategory) {
      trigger(`expenses.${index}.expenseCategory`);
    }
  };

  const getFilteredCategories = (index) => {
    const input = categoryInputs[index] || "";
    if (!input) return categories;
    return categories.filter((cat) =>
      cat.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleEditExpense = async (index) => {
    // If switching from another expense, validate it first
    if (editingIndex !== index && editingIndex >= 0) {
      const currentExpenseValid = await trigger(`expenses.${editingIndex}`);
      const currentExpense = getValues(`expenses.${editingIndex}`);

      if (!currentExpenseValid || !currentExpense.category) {
        setValidationMessage(
          "Please complete the current expense before editing another one."
        );
        return;
      }
    }
    setEditingIndex(index);
    setValidationMessage("");
  };

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    // No need to update categories here; global list is derived from Redux after fetch

    // Prepare payloads for API
    const mappedExpenses = data.expenses.map((expense) => ({
      expenseName: expense.expenseName,
      expenseCategory: expense.expenseCategory,
      expenseDescription: expense.expenseDescription,
      expenseDate: expense.expenseDate,
      expenseAmount: expense.expenseAmount,
      expensePriority: expense.expensePriority,
    }));

    try {
      let response;
      if (mappedExpenses.length === 1) {
        // Single expense
        response = await expenseAPI.addExpense(mappedExpenses[0]);
      } else {
        // Bulk expenses
        response = await expenseAPI.addExpensesBulk(mappedExpenses);
      }
      reset();
      setCategoryInputs({});
      setShowSuggestions({});
      setEditingIndex(0);
      // Refresh expenses list
      dispatch(fetchExpenses());
      toast.success('Expenses added successfully!');
      setTimeout(() => {
        onClose();
      }, 150);
    } catch (err) {
      setValidationMessage(err?.message || 'Failed to add expense(s)');
    }
  };

  const handleClose = () => {
    reset();
    setCategoryInputs({});
    setShowSuggestions({});
    setValidationMessage("");
    setEditingIndex(0);
    onClose();
  };

  const isExpenseComplete = (expense) => {
    return expense && expense.expenseName && expense.expenseAmount && expense.expenseCategory;
  };

  const isCurrentExpenseValid = () => {
    const currentExpense = watchedExpenses[editingIndex];
    if (!currentExpense) return false;

    const hasErrors = errors.expenses?.[editingIndex];
    const isComplete = isExpenseComplete(currentExpense);

    return isComplete && !hasErrors;
  };

  // Clear validation message when user starts typing in any field
  const handleInputChange = (callback) => {
    return (e) => {
      setValidationMessage("");
      callback(e);
    };
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-3 sm:p-6 max-h-[95vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Add expense form"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute text-xl text-gray-400 sm:text-2xl top-2 right-3 sm:top-3 sm:right-4 hover:text-gray-700"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="pr-8 mb-4 sm:mb-6">
          <Heading className="mb-2 text-xl sm:text-2xl">Add Expenses</Heading>
          <p className="text-sm text-detail">
            Add one or more expenses to track your spending
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, index) => {
            const expense = watchedExpenses[index];
            const isComplete = isExpenseComplete(expense);
            const isEditing = editingIndex === index;
            const filteredCategories = getFilteredCategories(index);
            const showDropdown =
              showSuggestions[index] && filteredCategories.length > 0;

            return (
              <div key={field.id}>
                {isComplete && !isEditing ? (
                  // Compact view for completed expenses
                  <div className="p-2 border border-green-200 rounded-lg sm:p-3 bg-green-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 mb-1 sm:gap-2">
                          <h4 className="font-medium text-primary text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                            {expense.expenseName}
                          </h4>
                          <span className="px-1.5 sm:px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full whitespace-nowrap">
                            Rs {expense.expenseAmount}
                          </span>
                          <span className="px-1.5 sm:px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full truncate max-w-[80px] sm:max-w-none">
                            {expense.expenseCategory}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-4 text-detail">
                          <span className="whitespace-nowrap">
                            {expense.expenseDate.split("-").reverse().join("-")}
                          </span>
                          <span className="whitespace-nowrap">
                            Priority: {expense.expensePriority}
                          </span>
                          {expense.expenseDescription && (
                            <span className="truncate max-w-[100px] sm:max-w-[200px]">
                              {expense.expenseDescription}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center flex-shrink-0 gap-1 ml-2">
                        <button
                          type="button"
                          onClick={() => handleEditExpense(index)}
                          className="p-1 text-blue-500 transition-colors hover:text-blue-700"
                        >
                          <BiEdit className="text-sm" />
                        </button>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              remove(index);
                              if (editingIndex >= index && editingIndex > 0) {
                                setEditingIndex(editingIndex - 1);
                              }
                              setValidationMessage("");
                            }}
                            className="p-1 text-red-500 transition-colors hover:text-red-700"
                          >
                            <BiTrash className="text-sm" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Full form view for incomplete or editing expenses
                  <div className="p-3 border border-gray-200 rounded-lg sm:p-4 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base font-medium sm:text-lg text-primary">
                        Expense {index + 1}
                      </h3>
                      <div className="flex items-center gap-1">
                        {isComplete && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingIndex(-1);
                              setValidationMessage("");
                            }}
                            className="px-1.5 sm:px-2 py-1 text-xs text-green-700 transition-colors bg-green-100 rounded hover:bg-green-200"
                          >
                            Done
                          </button>
                        )}
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              remove(index);
                              if (editingIndex >= index && editingIndex > 0) {
                                setEditingIndex(editingIndex - 1);
                              }
                              setValidationMessage("");
                            }}
                            className="p-1 text-red-500 transition-colors hover:text-red-700"
                          >
                            <BiTrash className="text-sm sm:text-lg" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                      <div>
                        <Input
                          label="Expense Name"
                          onChange={handleInputChange(() => {})}
                          {...register(`expenses.${index}.expenseName`, {
                            required: "Name is required",
                          })}
                        />
                        {errors.expenses?.[index]?.expenseName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.expenses[index].expenseName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Input
                          label="Amount"
                          type="number"
                          step="01"
                          onChange={handleInputChange(() => {})}
                          {...register(`expenses.${index}.expenseAmount`, {
                            required: "Amount is required",
                            min: {
                              value: 1,
                              message: "Amount must be greater than 0",
                            },
                          })}
                        />
                        {errors.expenses?.[index]?.expenseAmount && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.expenses[index].expenseAmount.message}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          label="Description (Optional)"
                          onChange={handleInputChange(() => {})}
                          {...register(`expenses.${index}.expenseDescription`)}
                        />
                      </div>

                      <div>
                        {/* Register the hidden field for react-hook-form validation */}
                        <input
                          type="hidden"
                          {...register(`expenses.${index}.expenseCategory`, {
                            required: "Category is required",
                          })}
                        />
                        <label className="block mb-2 text-sm font-medium text-primary">
                          Category
                        </label>
                        <div className="relative">
                          <div className="relative">
                            <input
                              type="text"
                              value={categoryInputs[index] || ""}
                              onChange={(e) =>
                                handleCategoryInputChange(index, e.target.value)
                              }
                              onFocus={() =>
                                setShowSuggestions((prev) => ({
                                  ...prev,
                                  [index]: true,
                                }))
                              }
                              placeholder="Type or select category"
                              className={`
                               w-full px-3 py-2 border border-gray-200 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent 
                               transition-colors pr-8
                               ${
                                 errors.expenses?.[index]?.expenseCategory
                                   ? "border-red-300"
                                   : ""
                               }
                             `}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowSuggestions((prev) => ({
                                  ...prev,
                                  [index]: !prev[index],
                                }))
                              }
                              className="absolute text-gray-400 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                            >
                              <IoChevronDown
                                className={`transition-transform ${
                                  showDropdown ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>

                          {showDropdown && (
                            <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-48">
                              {filteredCategories.map((category) => (
                                <button
                                  key={category}
                                  type="button"
                                  onClick={() =>
                                    handleCategorySelect(index, category)
                                  }
                                  className="w-full px-3 py-2 text-left transition-colors border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                                >
                                  {category}
                                </button>
                              ))}
                              {filteredCategories.length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  No matching categories found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {errors.expenses?.[index]?.expenseCategory && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.expenses[index].expenseCategory.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-primary">
                          Priority
                        </label>
                        <Select
                          options={priorities}
                          onChange={handleInputChange(() => {})}
                          {...register(`expenses.${index}.expensePriority`)}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          label="Date"
                          type="date"
                          onChange={handleInputChange(() => {})}
                          {...register(`expenses.${index}.expenseDate`, {
                            required: "Date is required",
                          })}
                        />
                        {errors.expenses?.[index]?.expenseDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.expenses[index].expenseDate.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Validation Message (only for errors) */}
          {validationMessage && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
              {validationMessage}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={addExpenseEntry}
              size="xs"
              disabled={!isCurrentExpenseValid()}
              className={`flex items-center gap-1 px-3 text-sm border border-gray-300 sm:gap-2 sm:text-base sm:px-4 transition-colors ${
                isCurrentExpenseValid()
                  ? "bg-gray-100 text-primary hover:bg-gray-200"
                  : "bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
            >
              <IoAdd />
              <span className="hidden xs:inline">Add Another</span> Expense
            </Button>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 sm:gap-3 sm:pt-6 sm:flex-row">
            <Button
              type="submit"
              size="xs"
              className="flex-1 text-sm sm:flex-none sm:px-6 lg:px-8 sm:text-base"
            >
              Upload {fields.length} Expense
              {fields.length > 1 ? "s" : ""}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              size="xs"
              category="secondary"
              className="flex-1 text-sm sm:flex-none sm:px-6 lg:px-8 sm:text-base"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
