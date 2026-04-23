import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Expense, Category, Budget } from './expense';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from './firebase.config';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesCollection = collection(db, 'expenses');
  private categoriesCollection = collection(db, 'categories');
  private budgetsCollection = collection(db, 'budgets');
  private expenseUnsubscribe: (() => void) | null = null;
  private categoriesUnsubscribe: (() => void) | null = null;
  private budgetUnsubscribe: (() => void) | null = null;
  currentUser = signal<User | null>(null);
  expense_list = signal<Expense[]>([]);
  rawCategories = signal<Category[]>([]);
  budget = signal<Budget | null>(null);
  categories = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    return this.rawCategories().filter((cat) => !cat.userId || cat.userId === user.uid);
  });
  num_expenses = computed(() => this.expense_list().length);
  max_expense = computed(() => this.max(this.expense_list()));
  avg_expense = computed(() => this.avg(this.expense_list()));
  total_expenses = computed(() => this.sum(this.expense_list()));
  budget_percentage = computed(() => {
    const budg = this.budget();
    const total = this.total_expenses();
    if (!budg || budg.amount <= 0) return 0;
    return (total / budg.amount) * 100;
  });
  budget_warning = computed(() => {
    const perc = this.budget_percentage();
    if (perc >= 100) return 'exceeded';
    if (perc >= 70) return 'warning';
    return null;
  });
  category_totals = computed(() => {
    const totals: Record<string, { total: number; color: string }> = {};
    const categoryColorMap = this.categories().reduce(
      (map, category) => {
        map[category.name] = category.color;
        return map;
      },
      {} as Record<string, string>,
    );

    this.expense_list().forEach((exp) => {
      const cat = exp.category;
      if (!totals[cat]) {
        totals[cat] = { total: 0, color: categoryColorMap[cat] || 'secondary' };
      }
      totals[cat].total += Math.abs(exp.amount);
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      total: value.total,
      color: value.color,
    }));
  });

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      if (this.expenseUnsubscribe) {
        this.expenseUnsubscribe();
        this.expenseUnsubscribe = null;
      }
      if (this.categoriesUnsubscribe) {
        this.categoriesUnsubscribe();
        this.categoriesUnsubscribe = null;
      }
      if (this.budgetUnsubscribe) {
        this.budgetUnsubscribe();
        this.budgetUnsubscribe = null;
      }

      if (!user) {
        this.expense_list.set([]);
        this.rawCategories.set([]);
        this.budget.set(null);
        return;
      }

      const userExpensesQuery = query(this.expensesCollection, where('userId', '==', user.uid));

      this.expenseUnsubscribe = onSnapshot(userExpensesQuery, (snapshot) => {
        const expenses = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Expense,
        );
        this.expense_list.set(expenses);
      });

      // Listen to all categories, filter in computed
      this.categoriesUnsubscribe = onSnapshot(this.categoriesCollection, (snapshot) => {
        const cats = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Category,
        );
        this.rawCategories.set(cats);
      });

      // Listen to user budget
      const userBudgetQuery = query(this.budgetsCollection, where('userId', '==', user.uid));
      this.budgetUnsubscribe = onSnapshot(userBudgetQuery, (snapshot) => {
        const budgets = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Budget,
        );
        this.budget.set(budgets.length > 0 ? budgets[0] : null);
      });
    });
  }

  max(list: Expense[]) {
    if (list.length === 0) return 0;
    var max_val = list[0].amount;
    list.forEach((elem) => {
      if (elem.amount > max_val) {
        max_val = elem.amount;
      }
    });
    return max_val;
  }

  sum(list: Expense[]) {
    var sum: number = 0;
    list.forEach((elem) => {
      sum += +elem.amount;
    });
    return sum;
  }

  avg(list: Expense[]) {
    if (list.length === 0) return 0;
    var sum: number = this.sum(list);
    const len: number = list.length;
    const toReturn: number = sum / len;
    return toReturn;
  }

  async addExpense(name: string, amt: number, category: string) {
    try {
      const user = this.currentUser();
      if (!user) {
        throw new Error('User must be signed in to add expenses.');
      }

      await addDoc(this.expensesCollection, {
        title: name,
        amount: amt,
        category: category,
        userId: user.uid,
      });
    } catch (error) {
      console.error('Error adding expense: ', error);
    }
  }

  async updateExpense(id: string, name: string, amt: number, category: string) {
    try {
      const user = this.currentUser();
      if (!user) {
        throw new Error('User must be signed in to update expenses.');
      }

      const docRef = doc(this.expensesCollection, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists() || snapshot.data()?.['userId'] !== user.uid) {
        throw new Error('Expense not found or not owned by current user.');
      }

      await updateDoc(docRef, {
        title: name,
        amount: amt,
        category: category,
      });
    } catch (error) {
      console.error('Error updating expense: ', error);
    }
  }

  async deleteExpense(id: string) {
    try {
      const user = this.currentUser();
      if (!user) {
        throw new Error('User must be signed in to delete expenses.');
      }

      const docRef = doc(this.expensesCollection, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists() || snapshot.data()?.['userId'] !== user.uid) {
        throw new Error('Expense not found or not owned by current user.');
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting expense: ', error);
    }
  }

  async addCategory(name: string, color: string) {
    try {
      const user = this.currentUser();
      if (!user) {
        throw new Error('User must be signed in to add categories.');
      }

      await addDoc(this.categoriesCollection, {
        name: name,
        color: color,
        userId: user.uid,
      });
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  }

  async setBudget(amount: number) {
    try {
      const user = this.currentUser();
      if (!user) {
        throw new Error('User must be signed in to set budget.');
      }

      const existingBudget = this.budget();
      if (existingBudget) {
        // Update existing
        const docRef = doc(this.budgetsCollection, existingBudget.id);
        await updateDoc(docRef, { amount });
      } else {
        // Add new
        await addDoc(this.budgetsCollection, {
          amount,
          userId: user.uid,
        });
      }
    } catch (error) {
      console.error('Error setting budget: ', error);
    }
  }
}
