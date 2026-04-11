import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../dashboard-component/dashboard-component';
import { Expense, ExpenseCategory } from '../expense';
import { ExpenseService } from '../expense-service';
//import { DataService } from '../data.service';

@Component({
  selector: 'app-add-expense',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
  expenseService = inject(ExpenseService);
  //showWarning = signal<boolean>(false); //Validation?

  onCreateExpense(expName: HTMLInputElement, expAmt: HTMLInputElement, expCat: HTMLSelectElement) {
    const name = expName.value;
    const amt = ((expAmt.value as unknown) as number);
    const cat = ((expCat.value as unknown) as ExpenseCategory);

    //Validation?

    this.expenseService.addExpense(name, amt, cat)

    expName.value = '';
    expAmt.value = '';
    expCat.value = 'Work';
  }

  // expense_title: string = ''
  // expense_amount: number = 0
  // expense_category: string = ''


}
