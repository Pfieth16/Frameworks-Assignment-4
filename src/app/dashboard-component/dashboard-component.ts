import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  expense_list = signal<number[]>([]);
  num_expenses = computed(() => this.expense_list().length);
  max_expense = computed(() => this.max(this.expense_list()));
  avg_expense = computed(() => this.avg(this.expense_list()));

  private max(list: number[]) {
    var max_val = list[0];
    list.forEach((elem, idx) => {
      if (elem > max_val) { max_val = elem; }
    })
    return max_val;
  }

  private avg(list: number[]) {
    var sum = 0;
    list.forEach((elem, idx) => { sum += elem; })
    return sum / list.length;
  }
}
