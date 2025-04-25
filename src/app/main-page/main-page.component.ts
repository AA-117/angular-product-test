import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Chart, ChartConfiguration, registerables} from "chart.js/auto";
import sanitizeHtml from 'sanitize-html';
import { v4 as uuidv4 } from 'uuid'
import {MatDialog} from "@angular/material/dialog";
import {AddGoalDialogComponent} from "../add-goal-dialog/add-goal-dialog.component";
import {GoalTransactionDialogComponent} from "../goal-transaction-dialog/goal-transaction-dialog.component";
import {Transaction} from "../../models/transaction.model";
import {SavingGoal} from "../../models/saving-goal.model";
import {Budget} from "../../models/budget.model";
import {of} from "rxjs";

Chart.register(...registerables)

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

  goalCategoryOptions: string[] = [];
  fullCategoryOptions: string[] = [];

  displayedColumns = ['category', 'planedBudget', 'remainBudget', 'action'];

  // simulate the total stand of user's bank account
  totalStand$ = of(3000);
  currentStand:number = 0;

  budgets: Budget[] = [
    { name: 'Lebensmittel', presetBudget: 100, remainBudget: 100, allowExtra: false, extraAllowed: 10},
    { name: 'Haushalt', presetBudget: 100, remainBudget: 100, allowExtra: false, extraAllowed: 10},
    { name: 'Gesundheit', presetBudget: 100, remainBudget: 100, allowExtra: false, extraAllowed: 10},
    { name: 'Spenden', presetBudget: 100, remainBudget: 100, allowExtra: true, extraAllowed: 10}
  ];
  goalBudgets: Budget[] = [];
  fullBudgets: Budget[] = [];

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
      created: new Date('2025-01-10'),
      deadline: new Date('2025-12-01'),
      index: 0
    },
    {
      id: uuidv4(),
      title: 'New Laptop',
      targetAmount: 1200,
      currentAmount: 800,
      created: new Date('2025-03-01'),
      index: 1
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
      description: [''],
      recurring: [false]
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
    this.updateCategoryOptions();
    this.updateBudgetList();
    this.totalStand$.subscribe(value => {
      this.currentStand = value;
    })
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
      if (budget >= 0) {
        const budgetToUpdate = this.budgets.find(b => b.name === category);
        if (budgetToUpdate) {
          budgetToUpdate.presetBudget = budget ? parseFloat(budget) : 0;
          budgetToUpdate.remainBudget = budgetToUpdate.presetBudget;
          budgetToUpdate.allowExtra = allowExtra;
          budgetToUpdate.extraAllowed = allowExtra ? (extraAllowed ? extraAllowed : 0) : 0;
        }
        this.budgetForm.reset();
      }
  }

  onAddTransaction(): void {
    const { type, value, category, date, recurring, description } = this.transactionForm.value;
    const amount = parseFloat(value);
    if (!category || isNaN(amount) || !date) return;
    const transId = uuidv4().toString();
    const formatDate = new Date(date).toLocaleDateString('de-DE');
    const desc = description ? sanitizeHtml(description, {
      allowedTags: [],
      allowedAttributes: {}
    }) : '';
    const newObj: Transaction = {id: transId, category: category, amount: amount, date: formatDate, type: type, description: desc, recurring: recurring};
    const isGoalTransaction = category.startsWith('Goal-');
    if (isGoalTransaction) {
      this.handleGoalTransaction(newObj);
    } else {
      this.handleNormalTransaction(newObj);
    }
    if (this.transactions.length > 0) {
      setTimeout(() => this.renderChart('doughnut'), 0);
    }
    this.transactionForm.reset({type: 'output'});
  }

  private handleGoalTransaction(obj: Transaction){
    const goalTitle = obj.category.split('-').slice(2).join('-');
    const goal = this.savingGoals.find(g => g.title === goalTitle);

    if(!goal) return;
    if(goal.deadline && this.parseGermanDate(obj.date) > goal.deadline) {
      alert("Da das Transaktionsdatum nach dem festgelegten Enddatum des Sparziels liegt, ist die Transaktion nicht zulässig.");
      return;
    }
    goal.currentAmount += (obj.type === 'output' ? obj.amount : -obj.amount);
    if(goal.currentAmount > goal.targetAmount) {
      alert("you have transferred more money as planned into the goal " + goal.title);
      goal.currentAmount -= obj.amount;
      return;
    }
    if(goal.currentAmount < 0) {
      alert("you are planning to withdraw more money as saved in the goal " + goal.title);
      goal.currentAmount += obj.amount;
      return;
    }
    if (this.updateAccountStand(obj)) {
      this.transactions.push(obj);
    } else {
      alert('Nicht genügend Geld auf dem Konto. Transaktion abgebrochen.');
      return;
    }
  }

  private parseGermanDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month -1 , day);
  }

  private handleNormalTransaction(obj: Transaction) {
    const budgetToUpdate = this.fullBudgets.find(b => b.name === obj.category);
    if (!budgetToUpdate) return;

    budgetToUpdate.extraAllowed = budgetToUpdate.allowExtra ? budgetToUpdate.extraAllowed : 0;
    const allowedOverspend = (budgetToUpdate.presetBudget * budgetToUpdate.extraAllowed) / 100;

    if (obj.type === 'output') {
      const isWithinLimit = (budgetToUpdate.remainBudget - obj.amount + allowedOverspend) >= 0;
      if (!isWithinLimit) {
        alert("Transaction exceeds the allowed extra limit and therefore is aborted.");
        return;
      }
      budgetToUpdate.remainBudget -= obj.amount;
      this.remainAmount = this.budgets.reduce((sum, bud) => sum + Math.max(bud.remainBudget, 0), 0);
    } else {
      budgetToUpdate.presetBudget += obj.amount;
      budgetToUpdate.remainBudget += obj.amount;
      this.totalAmount += obj.amount;
      this.remainAmount += obj.amount;
    }
    if (this.updateAccountStand(obj)) {
      this.transactions.push(obj);
    } else {
      alert('Nicht genügend Geld auf dem Konto. Transaktion abgebrochen.');
      return;
    }
  }

  onDeleteTransaction(index: number): void {
    const transaction = this.transactions[index];
    if (!transaction) return;

    const isGoalTransaction = transaction.category.startsWith('Goal-');
    if (isGoalTransaction) {
      this.deleteGoalTransaction(transaction, index);
    } else {
      this.deleteNormalTransaction(transaction, index);
    }
    setTimeout(() => this.renderChart('doughnut'), 0);
  }

  private deleteGoalTransaction(tx: Transaction, index: number): void {
    const goalTitle = tx.category.split('-').slice(2).join('-');
    const goal = this.savingGoals.find(g => g.title === goalTitle);
    if(!goal) return;
    goal.currentAmount -= (tx.type ==='output' ? tx.amount : -tx.amount);
    if(goal.currentAmount < 0) {
      alert('The remained amount of the goal ' + goal.title + ' cannot be negative.')
      return;
    }
    this.transactions.splice(index, 1);
  }

  private deleteNormalTransaction(tx: Transaction, index: number): void {
    const budget = this.budgets.find(b => b.name === tx.category);
    if (!budget) return;

    if (tx.type === 'output') {
      budget.remainBudget += tx.amount;
    } else {
      budget.presetBudget -= tx.amount;
      budget.remainBudget -= tx.amount;
      this.totalAmount -= tx.amount;
    }

    this.remainAmount = this.budgets.reduce((sum, b) => sum + Math.max(b.remainBudget ?? 0, 0), 0);
    this.transactions.splice(index, 1);
  }

  renderChart(type: string): void {
    const canvas = document.getElementById('transactionChart') as HTMLCanvasElement;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    const categoryTotals = this.fullBudgets.map(bud => {
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
    const i = (this.savingGoals.length === 0) ? -1 : Math.max(...this.savingGoals.map(goal => goal.index));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.savingGoals.push({
          id: uuidv4(),
          title: result.title,
          targetAmount: result.targetAmount,
          currentAmount: 0,
          created: new Date(),
          deadline: result.deadline,
          index: i+1
        });
        this.updateCategoryOptions();
        this.updateBudgetList()
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
    this.savingGoals
      .sort((a, b) => a.index - b.index)
      .forEach((goal, i ) => {
        goal.index = i;
      })
    this.updateCategoryOptions();
    this.updateBudgetList();
  }
  onGoalTransaction(goal: SavingGoal, type: 'input' | 'output') {
    const dialogRef = this.dialog.open(GoalTransactionDialogComponent, {
      width: '400px',
      data: { goal, type }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.amount) {
        const tx: Transaction = {
          id: uuidv4(),
          category: `Goal-${goal.index + 1}-${goal.title}`,
          amount: result.amount,
          type,
          date: new Date().toLocaleDateString('de-DE'),
          description: type === 'output' ? 'Einzahlung ins Sparziel ' + goal.title : 'Auszahlung vom Sparziel ' + goal.title,
          recurring: result.recurring ?? false
        };
        if (this.updateAccountStand(tx)) {
          this.transactions.push(tx);
          goal.currentAmount += (tx.type === 'output' ? tx.amount : -tx.amount);
          setTimeout(() => this.renderChart('doughnut'), 0);
        } else {
          alert('Nicht genügend Geld auf dem Konto. Transaktion abgebrochen.');
          return;
        }
      }
    });
  }

  updateCategoryOptions() {
    const baseCategories = this.goalCategoryOptions.filter(category => !category.startsWith('Goal-'));
    const goalCategories = this.savingGoals.map(
      goal => `Goal-${goal.index + 1}-${goal.title}`
    )
    this.goalCategoryOptions = [...baseCategories, ...goalCategories].sort((a,b) => a.localeCompare(b));
    this.fullCategoryOptions = [...this.categoryOptions, ...this.goalCategoryOptions].sort((a, b) =>a.localeCompare(b));
  }

  updateBudgetList() {
    const baseBudgets = this.goalBudgets.filter(budget => !budget.name.startsWith('Goal-'));
    const fakedGoalBudgets = this.savingGoals.map(
      goal => ({
        name: `Goal-${goal.index + 1}-${goal.title}`,
        presetBudget: -1,
        remainBudget: -1,
        allowExtra: false,
        extraAllowed: 0
      })
    )
    this.goalBudgets = [...baseBudgets, ...fakedGoalBudgets];
    this.fullBudgets = [...this.budgets, ...this.goalBudgets];
  }

  updateAccountStand(tx: Transaction) {
    let isValid = true;

    if (tx.type === 'output') {
      if (tx.amount > this.currentStand) {
        isValid = false;
        alert('Nicht genügend Geld auf dem Konto. Transaktion abgebrochen.');
      } else {
        this.currentStand -= tx.amount;
      }
    } else if (tx.type === 'input') {
      this.currentStand += tx.amount
    }
    return isValid;
  }
}
