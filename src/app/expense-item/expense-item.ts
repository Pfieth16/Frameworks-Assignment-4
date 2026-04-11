import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../expense-service';
import { Expense } from '../expense';

@Component({
  selector: 'app-expense-item',
  imports: [RouterLink],
  templateUrl: './expense-item.html',
  styleUrl: './expense-item.css',
})
export class ExpenseItem {
  expenseService = inject(ExpenseService);
  expense = input.required<Expense>();

  onDeleteExpense() {
    this.expenseService.deleteExpense(this.expense().id);
  }

  badgeClass() {
    const category = this.expense().category;
    if (!category) return 'badge bg-dark';

    switch (category) {
      case 'Food':
        return 'badge bg-primary';
      case 'Grocery':
        return 'badge bg-secondary';
      case 'Personal':
        return 'badge bg-success';
      case 'Shopping':
        return 'badge bg-danger';
      case 'Travel':
        return 'badge bg-warning';
      case 'Utilities':
        return 'badge bg-info';
      case 'Work':
        return 'badge bg-light';
    }
  }
}
