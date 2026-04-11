import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ExpenseService } from '../expense-service';
import { ExpenseCategory } from '../expense';

@Component({
  selector: 'app-edit-expense',
  imports: [RouterLink, RouterModule],
  templateUrl: './edit-expense.html',
  styleUrl: './edit-expense.css',
})
export class EditExpense {
  expenseService = inject(ExpenseService);
  id = input.required<string>();

  onUpdateExpense(expName: HTMLInputElement, expAmt: HTMLInputElement, expCat: HTMLSelectElement) {
    const name = expName.value;
    const amt = ((expAmt.value as unknown) as number);
    const cat = ((expCat.value as unknown) as ExpenseCategory);

    this.expenseService.updateExpense(this.id(), name, amt, cat)

    expName.value = '';
    expAmt.value = '';
    expCat.value = 'Work';
  }
}
