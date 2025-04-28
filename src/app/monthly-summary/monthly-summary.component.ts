import {Component, Input} from '@angular/core';
import {Transaction} from "../../models/transaction.model";

@Component({
  selector: 'app-monthly-summary',
  standalone: false,
  templateUrl: './monthly-summary.component.html',
  styleUrl: './monthly-summary.component.css'
})
export class MonthlySummaryComponent {
  @Input() transactions: Transaction[] = [];
  startDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  endDate: Date = new Date();
  filteredTransactions: Transaction[] = [];

  filterTransactions(): void {
    if (!this.startDate || !this.endDate) {
      this.filteredTransactions = [];
      return;
    }

    const start = this.startDate.getTime();
    const end = this.endDate.getTime();

    this.filteredTransactions = this.transactions.filter(tx => {
      const txDate = this.parseGermanDate(tx.date.toString()).getTime();
      return txDate >= start && txDate <= end;
    });
  }

  parseGermanDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  }
}
