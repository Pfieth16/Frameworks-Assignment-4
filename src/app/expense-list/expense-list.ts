import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../expense-service';
import { ExpenseItem } from '../expense-item/expense-item';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, FormsModule, RouterLink, ExpenseItem],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  expenseService = inject(ExpenseService);

  categoryFilter = signal<string>('');
  minAmountFilter = signal<number | null>(null);
  maxAmountFilter = signal<number | null>(null);

  filteredExpenses = computed(() => {
    let expenses = this.expenseService.expense_list();
    const category = this.categoryFilter();
    const minAmount = this.minAmountFilter();
    const maxAmount = this.maxAmountFilter();

    if (category) {
      expenses = expenses.filter((exp) => exp.category === category);
    }
    if (minAmount !== null) {
      expenses = expenses.filter((exp) => Math.abs(exp.amount) >= minAmount);
    }
    if (maxAmount !== null) {
      expenses = expenses.filter((exp) => Math.abs(exp.amount) <= maxAmount);
    }
    return expenses;
  });
}
