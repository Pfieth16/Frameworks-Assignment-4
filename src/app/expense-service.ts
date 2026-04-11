import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Expense, ExpenseCategory } from './expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  expense_list = signal<Expense[]>([]);
  num_expenses = computed(() => this.expense_list().length);
  max_expense = computed(() => this.max(this.expense_list()));
  avg_expense = computed(() => this.avg(this.expense_list()));

  max(list: Expense[]) {
    var max_val = list[0].amount;
    list.forEach((elem, idx) => {
      if (elem.amount > max_val) { max_val = elem.amount; }
    })
    return max_val;
  }

  sum(list: Expense[]) {
    var sum: number = 0;
    list.forEach((elem) => { sum += +elem.amount; })
    return sum;
  }

  avg(list: Expense[]) {
    var sum: number = this.sum(list);
    const len: number = list.length;
    const toReturn: number = sum / len;
    return toReturn;
  }

  addExpense(name: string, amt: number, category: ExpenseCategory) {
    const newExpense: Expense = {
      id: this.generateExpenseId(),
      title: name,
      amount: amt,
      category: category,
    };

    this.expense_list.update((expenses) => [...expenses, newExpense]);
  }

  deleteExpense(id: string) {
    this.expense_list.update((expenses) => expenses.filter((expense) => expense.id != id));
  }

  private generateExpenseId = () => {
    return 'expense-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  };
}
