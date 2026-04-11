import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { AddExpense } from './add-expense/add-expense';
import { ExpenseList } from './expense-list/expense-list';
import { EditExpense } from './edit-expense/edit-expense';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        title: 'Dashboard',
    },
    {
        path: 'add',
        component: AddExpense,
        title: 'Add Expense',
    },
    {
        path: 'expenses',
        component: ExpenseList,
        title: 'Expenses',
    },
    {
        path: 'edit/:id',
        component: EditExpense,
        title: 'Edit Expense',
    },
];
