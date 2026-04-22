import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../dashboard-component/dashboard-component';
import { Expense, Category, BOOTSTRAP_BADGE_COLORS } from '../expense';
import { ExpenseService } from '../expense-service';
//import { DataService } from '../data.service';

@Component({
  selector: 'app-add-expense',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
  expenseService = inject(ExpenseService);
  categories = this.expenseService.categories;
  badgeColors = BOOTSTRAP_BADGE_COLORS;

  onCreateExpense(
    expName: HTMLInputElement,
    expAmt: HTMLInputElement,
    expType: HTMLSelectElement,
    expCat: HTMLSelectElement,
  ) {
    const name = expName.value;
    let amt = parseFloat(expAmt.value);
    const type = expType.value;
    const cat = expCat.value;

    if (name && amt > 0 && cat) {
      if (type === 'Income' && amt > 0) {
        amt = -amt;
      }
      this.expenseService.addExpense(name, amt, cat);
      expName.value = '';
      expAmt.value = '';
      expType.value = 'Expense';
      expCat.value = '';
    }
  }

  onAddCategory(catName: HTMLInputElement, catColor: HTMLSelectElement) {
    const name = catName.value;
    const color = catColor.value;

    if (name && color) {
      this.expenseService.addCategory(name, color);
      catName.value = '';
      catColor.value = 'primary';
    }
  }
}
