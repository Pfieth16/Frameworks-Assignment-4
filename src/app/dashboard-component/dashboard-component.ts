import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Expense } from '../expense';
import { ExpenseService } from '../expense-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [RouterLink],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  expenseService = inject(ExpenseService);
}
