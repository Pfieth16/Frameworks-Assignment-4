import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
//import { DataService } from '../data.service';

@Component({
  selector: 'app-add-expense',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
  //dataService = inject(DataService);

  expense_title: string = ''
  expense_amount: number = 0
  expense_category: string = ''

}
