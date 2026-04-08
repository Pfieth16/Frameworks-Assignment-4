export interface Expense {
    id: string
    title: string
    amount: number
    category: ExpenseCategory
}

type ExpenseCategory = { "Work": string, "Personal": string, "Grocery": string, "Utilities": string, "Shopping": string, "Travel": string, "Food": string }

