import { useMemo } from "react";

export const useCurrentMonthYear = () => {
  return useMemo(() => {
    const now = new Date()
    const month = now.toLocaleString("default", { month: "long" })
    const year = now.getFullYear()
    return { month, year, label: `${month} ${year}` }
  }, [])
}
