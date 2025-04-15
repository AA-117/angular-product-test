import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Chart, ChartConfiguration, registerables} from "chart.js/auto";
import sanitizeHtml from 'sanitize-html';
import { v4 as uuidv4 } from 'uuid'
import {MatDialog} from "@angular/material/dialog";
import {AddGoalDialogComponent} from "../add-goal-dialog/add-goal-dialog.component";

Chart.register(...registerables)

interface Transaction {
  category: string,
  amount: number,
  date: string,
  type: string,
  description?: string
}

interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category?: string;
  notes?: string;
}

@Component({
  selector: 'app-main-page',
  standalone: false,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  tabs = ['Categories & Budgets', 'Transactions', 'Saving Goals'];
  activeTab = this.tabs[0];

  categoryOptions = ['Miete', 'Strom & Wasser', 'Internet & Handy', 'Lebensmittel', 'Haushalt', 'Transport / Benzin',
    'Versicherungen', 'Sparen', 'Notfallfonds', 'Schuldenrückzahlung', 'Freizeit / Hobbys', 'Ausgehen / Restaurants', 'Kleidung',
  'Geschenke', 'Gesundheit', 'Fitness / Sport', 'Beauty / Pflege', 'Haustiere', 'Kinder / Schule', 'Abo', 'Spenden', 'Urlaub / Reisen',
  'Auto', 'Sonstiges'].sort((a,b) => a.localeCompare(b));

  displayedColumns = ['category', 'planedBudget', 'remainBudget', 'action'];


  budgets = [
    { name: 'Lebensmittel', presetBudget: 100, remainBudget: 100, allowExtra: false, extraAllowed: 10},
    { name: 'Haushalt', presetBudget: 100, remainBudget: 100, allowExtra: false, extraAllowed: 10},
    { name: 'Gesundheit', presetBudget: 100, remainBudget: 100, allowExtra: false, extraAllowed: 10},
    { name: 'Spenden', presetBudget: 100, remainBudget: 100, allowExtra: true, extraAllowed: 10}
  ];

  totalAmount = this.budgets.reduce((sum1, budget) => sum1 + budget.presetBudget, 0);
  remainAmount = this.budgets.reduce((sum2, budget) => sum2 + budget.remainBudget, 0);

  transactionForm: FormGroup;
  budgetForm: FormGroup;
  categoryForm: FormGroup;
  transactions: Transaction[] = [];

  chart: any = [];

  colors: { [key: string]: string } = {
    Lebensmittel: '#FF6384',
    Haushalt: '#36A2EB',
    Gesundheit: '#FFCE56',
    Spenden: '#4BC0C0'
  };

  savingGoals: SavingGoal[] = [
    {
      id: uuidv4(),
      title: 'Vacation Fund',
      targetAmount: 2000,
      currentAmount: 450,
      deadline: new Date('2025-12-01'),
    },
    {
      id: uuidv4(),
      title: 'New Laptop',
      targetAmount: 1200,
      currentAmount: 800,
    }
  ];

  // goal!: SavingGoal;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.transactionForm = this.fb.group({
      value: [''],
      category: [''],
      date: [''],
      type: ['output', Validators.required],
      description: ['']
    });

    this.budgetForm = this.fb.group({
      category: [''],
      budget: [''],
      allowExtra: false,
      extraAllowed: ['']
    });

    this.categoryForm = this.fb.group({
      name: ['']
    });
  }

  switchTab(tab: string): void {
    if(this.transactions.length > 0) {
      setTimeout(() => this.renderChart('doughnut'), 0);
    }
    this.activeTab = tab;
    this.totalAmount = this.budgets.reduce((sum1, bud) => sum1 + bud.presetBudget, 0);
    this.remainAmount = this.budgets.reduce((sum2, bud) => sum2 + bud.remainBudget, 0);
  }

  onAddCategory(): void {
    const { name } = this.categoryForm.value;
    if (name && !this.budgets.some(bud => bud.name === name)) {
      // this.categories.push({name});
      this.budgets.push({ name, presetBudget: 0, remainBudget: 0, allowExtra: false, extraAllowed: 0 });

      if (!this.colors[name]) {
        this.colors[name] = this.generateRandomColor();
      }
    }
    this.budgets = [...this.budgets];
    this.categoryForm.reset();
  }

  onRemoveCategory(categoryName: string): void {
    // this.categories = this.categories.filter(cat => cat.name !== categoryName);
    this.budgets = this.budgets.filter(budget => budget.name !== categoryName);

    delete this.colors[categoryName];
  }

  onSetBudget(): void {
    const { category, budget, allowExtra, extraAllowed } = this.budgetForm.value;
    const budgetToUpdate = this.budgets.find(b => b.name === category);
    if (budgetToUpdate) {
      budgetToUpdate.presetBudget = budget ? parseFloat(budget) : 0;
      budgetToUpdate.remainBudget = budgetToUpdate.presetBudget;
      budgetToUpdate.allowExtra = allowExtra;
      budgetToUpdate.extraAllowed = allowExtra ? (extraAllowed ? extraAllowed: 0) : 0;
    }
    this.budgetForm.reset();
  }

  onAddTransaction(): void {
    const { type, value, category, date, description } = this.transactionForm.value;
    const amount = parseFloat(value);
    const formatDate = new Date(date).toLocaleDateString('de-DE');
    const desc = description!== null ? sanitizeHtml(description, {
      allowedTags: [],
      allowedAttributes: {}
    }) : '';
    const newObj = {category: category, amount: amount, date: formatDate, type: type, description: desc} as Transaction;
    if(type === 'output'){
      if (!isNaN(amount) && category && date) {
        const budgetToUpdate = this.budgets.find(bud => bud.name === category);
        if (budgetToUpdate) {
          if (!budgetToUpdate.allowExtra) {
            budgetToUpdate.extraAllowed = 0;
          }
          if (budgetToUpdate.remainBudget - amount + budgetToUpdate.presetBudget * budgetToUpdate.extraAllowed / 100 >= 0) {
            budgetToUpdate.remainBudget -= amount;
            this.transactions.push(newObj);
            this.remainAmount = this.budgets.reduce((sum, bud) => sum + Math.max(bud.remainBudget, 0), 0);
          } else {
            alert("Transaction exceeds the allowed extra limit and therefore is aborted.");
          }
        }
      }
      if (this.transactions.length > 0) {
        setTimeout(() => this.renderChart('doughnut'), 0);
      }
    } else {
      if(!isNaN(amount) && category && date) {
        this.transactions.push(newObj);
      }
    }
    this.transactionForm.reset({type: 'output'});
  }

  onDeleteTransaction(index: number): void {
    const transaction = this.transactions[index];
    const transactionToUpdate = this.budgets.find(bud => bud.name === transaction.category);
    if (transactionToUpdate && transaction.type === 'output') {
      transactionToUpdate.remainBudget += transaction.amount;
      this.remainAmount = this.budgets.reduce((sum, bud) => sum + bud.remainBudget, 0);
      setTimeout(() => this.renderChart('doughnut'), 0);
    }
    this.transactions.splice(index, 1);
  }

  renderChart(type: string): void {
    const canvas = document.getElementById('transactionChart') as HTMLCanvasElement;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    const categoryTotals = this.budgets.map(bud => {
      const total = this.transactions
        .filter(transaction => transaction.category === bud.name && transaction.type === 'output')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      return { name: bud.name, total };
    });

    const data = {
      labels: categoryTotals.map(cat => cat.name),
      datasets: [
        {
          data: categoryTotals.map(cat => cat.total),
          label: 'Transaction Amount in Category',
          backgroundColor: categoryTotals.map(cat => this.colors[cat.name])
        }
      ]
    };

    if(this.chart instanceof Chart) {
      this.chart.destroy();
      this.chart = null;
    }

    if (type === 'doughnut') {
      const doughnutConfig: ChartConfiguration<'doughnut'> = {
        type: 'doughnut',
        data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      };
      this.chart = new Chart(ctx, doughnutConfig);
    }

    if (type === 'bar') {
      const barConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                autoSkip: false, // Ensures labels are not skipped
                maxRotation: 45, // Adjust rotation for better visibility
                minRotation: 0
              },
              title: {
                display: true,
                text: 'Categories' // Add a title to the X-axis
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount (€)' // Add a title to the Y-axis
              }
            }
          }
        }
      };
      this.chart = new Chart(ctx, barConfig);
    }
  }

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getGoalProgress(goal: SavingGoal): number {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }
  getGoalProgressPercentage(goal: SavingGoal): string {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toLocaleString('de-DE', {
      maximumFractionDigits: 2,
    });
  }

  onAddGoal() {
    const dialogRef = this.dialog.open(AddGoalDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.savingGoals.push({
          id: uuidv4(),
          title: result.title,
          targetAmount: result.targetAmount,
          currentAmount: 0,
          deadline: result.deadline
        });
      }
    });
  }

  onEditGoal(goal: SavingGoal) {
    const dialogRef = this.dialog.open(AddGoalDialogComponent, {
      width: '350px',
      data: { ...goal }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.savingGoals.findIndex(g => g.id === goal.id);
        if (index !== -1) {
          this.savingGoals[index] = {
            ...this.savingGoals[index],
            title: result.title,
            targetAmount: result.targetAmount,
            deadline: result.deadline
          };
        }
      }
    });
  }

  onDeleteGoal(goal: SavingGoal) {
    this.savingGoals = this.savingGoals.filter(g => g.id !== goal.id);
  }

  onDeposit(goal: SavingGoal) {
    console.log('Deposit into:', goal.title);
  }

  onWithdraw(goal: SavingGoal) {
    console.log('Withdraw from:', goal.title);
  }
}
