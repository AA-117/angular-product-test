import { Component, type OnInit } from "@angular/core"
import { DashboardService } from "../../services/dashboard.service"
import { Transaction, SavingsGoal, SpendingCategory, UserBalance } from "../material/dashboard.module"

@Component({
  selector: "app-neobank-dashboard",
  standalone: false,
  templateUrl: "./neobank-dashboard.component.html",
  styleUrl: "./neobank-dashboard.component.css",
})
export class NeobankDashboardComponent implements OnInit {
  transactions: Transaction[] = []
  savingsGoals: SavingsGoal[] = []
  spendingCategories: SpendingCategory[] = []
  userBalance!: UserBalance
  budgetProgress!: { current: number; max: number; percentage: number }
  spendingBreakdown: { category: string; amount: number; percentage: number }[] = []

  activeTab: "transactions" | "insights" = "transactions"

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getTransactions().subscribe((data) => {
      this.transactions = data
    })

    this.dashboardService.getSavingsGoals().subscribe((data) => {
      this.savingsGoals = data
    })

    this.dashboardService.getSpendingCategories().subscribe((data) => {
      this.spendingCategories = data
    })

    this.dashboardService.getUserBalance().subscribe((data) => {
      this.userBalance = data
    })

    this.dashboardService.getBudgetProgress().subscribe((data) => {
      this.budgetProgress = data
    })

    this.dashboardService.getSpendingBreakdown().subscribe((data) => {
      this.spendingBreakdown = data
    })
  }

  setActiveTab(tab: "transactions" | "insights"): void {
    this.activeTab = tab
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  getProgressBarClass(percentage: number): string {
    return `progress-bar w-[${percentage}%]`
  }

  trackById(index: number, item: any): string {
    return item.id
  }
}

