import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"
import { Transaction, SavingsGoal, SpendingCategory, UserBalance } from "../app/material/dashboard.module"

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private transactions: Transaction[] = [
    {
      id: "1",
      title: "Spotify Subscription",
      amount: 9.99,
      date: new Date("2023-04-23"),
      type: "expense",
      category: "entertainment",
      icon: "music",
    },
    {
      id: "2",
      title: "Salary (Acme Inc.)",
      amount: 2500.0,
      date: new Date("2023-04-20"),
      type: "income",
      category: "salary",
      icon: "arrow-up",
    },
    {
      id: "3",
      title: "Groceries",
      amount: 82.35,
      date: new Date("2023-04-18"),
      type: "expense",
      category: "food",
      icon: "shopping-cart",
    },
  ]

  private savingsGoals: SavingsGoal[] = [
    {
      id: "1",
      title: "Vacation to Italy",
      currentAmount: 450,
      targetAmount: 1000,
      startDate: new Date("2023-04-01"),
      targetDate: new Date("2023-07-15"),
      status: "in-progress",
    },
    {
      id: "2",
      title: "Emergency Fund",
      currentAmount: 2500,
      targetAmount: 5000,
      startDate: new Date("2023-01-01"),
      targetDate: null,
      status: "ongoing",
    },
  ]

  private spendingCategories: SpendingCategory[] = [
    { name: "Food", amount: 450, percentage: 32 },
    { name: "Transport", amount: 320, percentage: 23 },
    { name: "Shopping", amount: 630, percentage: 45 },
  ]

  private userBalance: UserBalance = {
    total: 3420.5,
    currency: "€",
    percentageChange: 12.5,
  }

  constructor() {}

  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions)
  }

  getSavingsGoals(): Observable<SavingsGoal[]> {
    return of(this.savingsGoals)
  }

  getSpendingCategories(): Observable<SpendingCategory[]> {
    return of(this.spendingCategories)
  }

  getUserBalance(): Observable<UserBalance> {
    return of(this.userBalance)
  }

  getBudgetProgress(): Observable<{ current: number; max: number; percentage: number }> {
    return of({ current: 1400, max: 2000, percentage: 70 })
  }

  getSpendingBreakdown(): Observable<{ category: string; amount: number; percentage: number }[]> {
    return of([
      { category: "Entertainment", amount: 120, percentage: 40 },
      { category: "Food & Dining", amount: 350, percentage: 70 },
      { category: "Shopping", amount: 200, percentage: 50 },
    ])
  }
}

