import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { Expense } from '../expense';
import { ExpenseService } from '../expense-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  expenseService = inject(ExpenseService);

  pieChartData = computed(() => {
    const totals = this.expenseService.category_totals();
    const totalSum = totals.reduce((sum, cat) => sum + cat.total, 0);
    const colorMap: Record<string, string> = {
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#0dcaf0',
      light: '#f8f9fa',
      dark: '#212529',
    };

    return {
      labels: totals.map((cat) => cat.name),
      datasets: [
        {
          data: totals.map((cat) => (totalSum > 0 ? (cat.total / totalSum) * 100 : 0)),
          backgroundColor: totals.map((cat) => colorMap[cat.color] || '#C9CBCF'),
        },
      ],
    };
  });

  expenseTypeChartData = computed(() => {
    const expenses = this.expenseService.expense_list();
    var expenseAmt = 0;
    var incomeAmt = 0;
    expenses.forEach((expense) => {
      if (expense.amount > 0) {
        expenseAmt += expense.amount;
      } else {
        incomeAmt += Math.abs(expense.amount);
      }
    });

    return {
      labels: ['Expenses', 'Income'],
      datasets: [
        {
          label: 'Amount',
          data: [expenseAmt, incomeAmt],
          backgroundColor: ['#dc3545', '#198754'],
        },
      ],
    };
  });

  onSetBudget(budgetInput: HTMLInputElement) {
    const amount = parseFloat(budgetInput.value);
    if (amount > 0) {
      this.expenseService.setBudget(amount);
      budgetInput.value = '';
    }
  }
}
