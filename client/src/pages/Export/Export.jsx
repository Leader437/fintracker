import { useSelector } from "react-redux"
import { useFormat } from "../../hooks"
import { Button, Heading } from "../../components"
import { BsDownload } from "react-icons/bs"
import jsPDF from "jspdf"

const Export = () => {
  const currency = "Rs"
  const expenses = useSelector((state) => state.expense.expenses)

  const formattedExpenses = useFormat(expenses)

  const formatMonthExpenses = formattedExpenses.reduce((acc, expense) => {
    const [month, day, year] = expense.date.split(" ")
    if (!acc[`${month} ${year}`]) {
      acc[`${month} ${year}`] = []
    }
    acc[`${month} ${year}`].push(expense)
    return acc
  }, {})

const handleDownload = (monthKey) => {
  const doc = new jsPDF()
  let currentY = 20
  const pageHeight = doc.internal.pageSize.height

  doc.setFontSize(16)
  doc.text(`${monthKey} - Detailed Report`, 14, currentY)
  currentY += 15

  // Clone & sort the days in ascending (earliest -> latest) by actual date
  const monthExpenses = [...formatMonthExpenses[monthKey]].sort((a, b) => {
    const da = new Date(a.date)
    const db = new Date(b.date)
    if (!isNaN(da) && !isNaN(db)) return da - db
    // Fallback manual parse: "MonthName DD YYYY"
    const parse = (dStr) => {
      const [mName, dayStr, yearStr] = dStr.split(" ")
      return new Date(`${mName} ${dayStr.replace(',', '')} ${yearStr}`)
    }
    return parse(a.date) - parse(b.date)
  })

  monthExpenses.forEach((day) => {
    if (currentY > pageHeight - 40) {
      doc.addPage()
      currentY = 20
    }

    // date + total row
    doc.setFontSize(12)
    doc.setFont(undefined, "italic")
    doc.text(`${day.date}`, 14, currentY)
    doc.text(
      `${day.total} ${currency} Total`,
      doc.internal.pageSize.width - 14,
      currentY,
      { align: "right" }
    )
    currentY += 2

    // line under header
    doc.line(14, currentY, doc.internal.pageSize.width - 14, currentY)
    currentY += 6

    // table header (bold)
    doc.setFontSize(10)
    doc.setFont(undefined, "bold")
    doc.text("Name", 14, currentY)
    doc.text("Amount", 50, currentY)
    doc.text("Description", 90, currentY)
    doc.text("Category", 140, currentY)
    doc.text("Priority", 170, currentY)
    currentY += 6

    // table rows (normal)
    doc.setFont(undefined, "normal")
    day.items.forEach((item) => {
      if (currentY > pageHeight - 20) {
        doc.addPage()
        currentY = 20
      }

      doc.text(item.name, 14, currentY)
      doc.text(`${item.amount} ${currency}`, 50, currentY)

      const desc = doc.splitTextToSize(item.description || "-", 45)
      doc.text(desc, 90, currentY)

      doc.text(item.category || "-", 140, currentY)
      doc.text(item.priority || "-", 170, currentY)

      const descHeight = desc.length * 5
      currentY += Math.max(6, descHeight)
    })

    currentY += 12 // space before next day block
  })

  doc.save(`${monthKey}.pdf`)
}



  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-4 pr-1 mb-2">
        <Heading className="text-xl sm:text-2xl">Export Data</Heading>
      </div>
      <div className="w-full mb-3 border-b border-[rgba(128,128,128,0.3)]"></div>

      {Object.keys(formatMonthExpenses).length === 0 && (
        <p className="text-sm text-gray-500">No expenses available.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.keys(formatMonthExpenses).map((m) => (
          <div
            key={m}
            className="relative p-4 transition bg-white border rounded-lg shadow-sm border-gray-200/70 hover:shadow-md group"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-base font-semibold leading-tight">{m}</h2>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-primary">
                {formatMonthExpenses[m].length}{" "}
                {formatMonthExpenses[m].length === 1
                  ? "day data"
                  : "days data"}
              </span>
            </div>
            <p className="mb-1 text-sm text-gray-500">Total Spent</p>
            <p className="text-lg font-bold text-gray-800">
              {currency}{" "}
              {formatMonthExpenses[m].reduce((sum, e) => sum + e.total, 0)}
            </p>

            <div className="mt-4">
              <Button size="xs" onClick={() => handleDownload(m)}>
                <BsDownload />
              </Button>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 transition-all origin-left scale-x-0 rounded-b-lg bg-accent group-hover:scale-x-100"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Export
