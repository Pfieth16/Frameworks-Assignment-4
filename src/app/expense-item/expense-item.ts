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
  expense = input.required<Expense>(); //Check here for problems

  onDeleteExpense() {
    this.expenseService.deleteExpense(this.expense().id);
  }
}
