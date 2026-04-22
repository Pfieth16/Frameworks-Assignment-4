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
    const categoryName = this.expense().category;
    const cat = this.expenseService.categories().find((c) => c.name === categoryName);
    return cat ? `badge bg-${cat.color}` : 'badge bg-dark';
  }
}
