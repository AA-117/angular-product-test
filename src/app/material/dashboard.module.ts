export interface Transaction {
  id: string
  title: string
  amount: number
  date: Date
  type: "income" | "expense"
  category: string
  icon: string
}

export interface SavingsGoal {
  id: string
  title: string
  currentAmount: number
  targetAmount: number
  startDate: Date
  targetDate: Date | null
  status: "in-progress" | "completed" | "ongoing"
}

export interface SpendingCategory {
  name: string
  amount: number
  percentage: number
}

export interface UserBalance {
  total: number
  currency: string
  percentageChange: number
}

