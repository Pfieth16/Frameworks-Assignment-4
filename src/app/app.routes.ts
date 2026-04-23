import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { AddExpense } from './add-expense/add-expense';
import { ExpenseList } from './expense-list/expense-list';
import { EditExpense } from './edit-expense/edit-expense';
import { LoginComponent } from './login/login';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    title: 'Dashboard',
  },
  {
    path: 'add',
    component: AddExpense,
    canActivate: [AuthGuard],
    title: 'Add Expense',
  },
  {
    path: 'expenses',
    component: ExpenseList,
    canActivate: [AuthGuard],
    title: 'Expenses',
  },
  {
    path: 'edit/:id',
    component: EditExpense,
    canActivate: [AuthGuard],
    title: 'Edit Expense',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
