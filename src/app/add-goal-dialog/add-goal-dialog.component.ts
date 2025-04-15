import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-goal-dialog',
  standalone: false,
  templateUrl: './add-goal-dialog.component.html',
  styleUrl: './add-goal-dialog.component.css'
})
export class AddGoalDialogComponent {
  title = '';
  targetAmount!: number;
  deadline?: Date;

  constructor(
    public dialogRef: MatDialogRef<AddGoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.title = data.title;
      this.targetAmount = data.targetAmount;
      this.deadline = data.deadline ? data.deadline : '';
    }
  }

  onSave() {
    if (this.title && this.targetAmount) {
      this.dialogRef.close({
        title: this.title,
        targetAmount: this.targetAmount,
        deadline: this.deadline
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
