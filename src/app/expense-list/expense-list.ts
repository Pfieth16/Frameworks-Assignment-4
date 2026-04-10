import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../expense-service';
import { ExpenseItem } from '../expense-item/expense-item';

@Component({
  selector: 'app-expense-list',
  imports: [RouterLink, ExpenseItem],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  expenseService = inject(ExpenseService);
}
