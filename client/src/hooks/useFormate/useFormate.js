import { useMemo } from "react";

const useFormat = (expenses) => {
    const formateExpenses = useMemo(() => {
        const monthsNames = {
            "01": "January",
            "02": "February",
            "03": "March",
            "04": "April",
            "05": "May",
            "06": "June",
            "07": "July",
            "08": "August",
            "09": "September",
            "10": "October",
            "11": "November",
            "12": "December"
        }

        // grouped Expenses by date
        let groupedExpenses = Object.values(
            expenses.reduce((acc, expense) => {
                if (!acc[expense.date]) {
                    acc[expense.date] = { date: expense.date, items: [], total: 0 };
                }
                acc[expense.date].items.push(expense);
                acc[expense.date].total += expense.amount;
                return acc;
            }, {})
        );

        // sorted Expenses by date (newest first)
        groupedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        // format date to Month day, year (e.g., November 10, 2023)
        groupedExpenses = groupedExpenses.map(group => {
            const [year, month, day] = group.date.split("-");
            return {
                ...group,
                date: `${monthsNames[month]} ${day}, ${year}`
            };
        });

        return groupedExpenses;
    }, [expenses]);

    return formateExpenses;
}

export default useFormat;