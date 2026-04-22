import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ExpenseService } from '../expense-service';
import { Expense, Category } from '../expense';

@Component({
  selector: 'app-edit-expense',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './edit-expense.html',
  styleUrl: './edit-expense.css',
})
export class EditExpense {
  expenseService = inject(ExpenseService);
  categories = this.expenseService.categories;
  id = input.required<string>();

  onUpdateExpense(expName: HTMLInputElement, expAmt: HTMLInputElement, expCat: HTMLSelectElement) {
    const name = expName.value;
    const amt = parseFloat(expAmt.value);
    const cat = expCat.value;

    if (name && amt > 0 && cat) {
      this.expenseService.updateExpense(this.id(), name, amt, cat);
    }
  }
}
