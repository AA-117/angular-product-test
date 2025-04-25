import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SavingGoal} from "../../models/saving-goal.model";

@Component({
  selector: 'app-goal-transaction-dialog',
  templateUrl: './goal-transaction-dialog.component.html',
  standalone: false,
  styleUrl: './goal-transaction-dialog.component.css'
})

export class GoalTransactionDialogComponent {
  amount: number | null = null;
  recurring: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<GoalTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { goal: SavingGoal, type: 'input' | 'output' }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (!this.amount || this.amount <= 0) return;

    const simulatedAmount =
      this.data.type === 'output'
        ? this.data.goal.currentAmount + this.amount
        : this.data.goal.currentAmount - this.amount;

    if (simulatedAmount > this.data.goal.targetAmount) {
      alert('Der eingezahlte Betrag überschreitet das Sparziel.');
      this.amount = null;
      return;
    }

    if (simulatedAmount < 0) {
      alert('Der auszuzahlende Betrag überschreitet den verfügbaren Betrag.');
      this.amount = null;
      return;
    }

    this.dialogRef.close({
      amount: this.amount,
      recurring: this.recurring
    });
  }


  get progress(): number {
    return Math.min(this.data.goal.currentAmount / this.data.goal.targetAmount * 100, 100);
  }
}
