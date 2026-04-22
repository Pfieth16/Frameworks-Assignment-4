import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../expense-service';
import { Expense, Category } from '../expense';

@Component({
  selector: 'app-edit-expense',
  imports: [CommonModule],
  templateUrl: './edit-expense.html',
  styleUrl: './edit-expense.css',
})
export class EditExpense {
  expenseService = inject(ExpenseService);
  categories = this.expenseService.categories;
  router = inject(Router);
  route = inject(ActivatedRoute);
  expenseId = signal<string | null>(null);
  expense = computed<Expense | undefined>(() => {
    const id = this.expenseId();
    return id ? this.expenseService.expense_list().find((expense) => expense.id === id) : undefined;
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.expenseId.set(id);
    }
  }

  async onUpdateExpense(
    expName: HTMLInputElement,
    expAmt: HTMLInputElement,
    expCat: HTMLSelectElement,
  ) {
    const id = this.expenseId();
    const name = expName.value;
    const amt = parseFloat(expAmt.value);
    const cat = expCat.value;

    if (id && name && !Number.isNaN(amt) && amt !== 0 && cat) {
      await this.expenseService.updateExpense(id, name, amt, cat);
      this.router.navigate(['/expenses']);
    }
  }

  onCancel() {
    this.router.navigate(['/expenses']);
  }
}
