import { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CompareExpenses = ({ expenses = [] }) => {
  // flatten/normalize incoming data first to {amount, date}
  const flatExpenses = expenses.map((e) => {
    return { amount: e.total, date: e.items[0].date };
  });

  // Extract unique months from normalized expenses
  const availableMonths = useMemo(() => {
    const months = new Set(flatExpenses.map((e) => e.date.slice(0, 7)));
    return Array.from(months).sort().reverse();
  }, [flatExpenses]);

  const [selectedMonth1, setSelectedMonth1] = useState("");
  const [selectedMonth2, setSelectedMonth2] = useState("");

  // preselect most recent two months when available
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth1) {
      setSelectedMonth1(availableMonths[0]);
    }
    if (availableMonths.length > 1 && !selectedMonth2) {
      setSelectedMonth2(availableMonths[1]);
    }
  }, [availableMonths, selectedMonth1, selectedMonth2]);

  // small hint if nothing could be parsed
  useEffect(() => {
    if (
      !availableMonths.length &&
      (Array.isArray(expenses) ? expenses.length : 0) > 0
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        "CompareExpenses: Could not derive months from expenses prop. Sample:",
        expenses[0]
      );
    }
  }, [availableMonths, expenses]);

  // Ensure both selects never have the same month
  useEffect(() => {
    if (selectedMonth1 && selectedMonth2 && selectedMonth1 === selectedMonth2) {
      const alternative =
        availableMonths.find((m) => m !== selectedMonth1) || "";
      setSelectedMonth2(alternative);
    }
  }, [selectedMonth1, selectedMonth2, availableMonths]);

  // Process data for selected months
  const chartData = useMemo(() => {
    if (!selectedMonth1 || !selectedMonth2) return [];
    const month1Data = {};
    const month2Data = {};
    flatExpenses.forEach((e) => {
      const [y, m, d] = e.date.split("-");
      const key = `${y}-${m}`;
      const day = parseInt(d, 10);
      if (key === selectedMonth1)
        month1Data[day] = (month1Data[day] || 0) + e.amount;
      else if (key === selectedMonth2)
        month2Data[day] = (month2Data[day] || 0) + e.amount;
    });
    return Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      month1: month1Data[i + 1] || 0,
      month2: month2Data[i + 1] || 0,
    }));
  }, [flatExpenses, selectedMonth1, selectedMonth2]);

  // detect small screens for responsive chart spacing
  const [isSmall, setIsSmall] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const chartMargin = useMemo(
    () => ({
      top: 16,
      right: isSmall ? 4 : 24, // less side margin on small screens
      left: isSmall ? 4 : 16,
      bottom: isSmall ? 36 : 48, // extra space for legend at the bottom
    }),
    [isSmall]
  );

  return (
    <div
      className="relative p-6 pt-0"
      role="dialog"
      aria-modal="true"
      aria-label="Compare expenses modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full">
        {/* Month selection dropdowns */}
        <div className="flex justify-center gap-4 p-6 sm:gap-8 md:gap-12">
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium sm:text-sm">
              Month 1
            </label>
            <select
              value={selectedMonth1}
              onChange={(e) => setSelectedMonth1(e.target.value)}
              className="px-1 py-2 text-sm border border-gray-300 rounded-md cursor-pointer sm:px-3"
            >
              <option value="">Select Month</option>
              {availableMonths
                .filter((month) => month !== selectedMonth2) // exclude Month 2 selection
                .map((month) => (
                  <option key={month} value={month}>
                    {new Date(month + "-01").toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium sm:text-sm">
              Month 2
            </label>
            <select
              value={selectedMonth2}
              onChange={(e) => setSelectedMonth2(e.target.value)}
              className="px-1 py-2 text-sm border border-gray-300 rounded-md cursor-pointer sm:px-3"
            >
              <option value="">Select Month</option>
              {availableMonths
                .filter((month) => month !== selectedMonth1) // exclude Month 1 selection
                .map((month) => (
                  <option key={month} value={month}>
                    {new Date(month + "-01").toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full min-h-[240px] h-[65vh] max-h-[520px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={isSmall ? false : { fontSize: 11, fill: "#64748b" }} // hide ticks on small screens
                tickMargin={6}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fontSize: isSmall ? 10 : 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                width={isSmall ? 30 : 40}
              />
              <Tooltip
                contentStyle={{ fontSize: isSmall ? 11 : 12 }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: 8, fontSize: isSmall ? 11 : 12 }}
              />
              <Line
                type="monotone"
                dataKey="month1"
                stroke="#8884d8"
                strokeWidth={2}
                dot={isSmall ? false : { r: 3 }}
                name={
                  selectedMonth1
                    ? new Date(selectedMonth1 + "-01").toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Month 1"
                }
              />
              <Line
                type="monotone"
                dataKey="month2"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={isSmall ? false : { r: 3 }}
                name={
                  selectedMonth2
                    ? new Date(selectedMonth2 + "-01").toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Month 2"
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CompareExpenses;
