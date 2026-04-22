import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Expense, Category } from './expense';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.config';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesCollection = collection(db, 'expenses');
  private categoriesCollection = collection(db, 'categories');
  expense_list = signal<Expense[]>([]);
  categories = signal<Category[]>([]);
  num_expenses = computed(() => this.expense_list().length);
  max_expense = computed(() => this.max(this.expense_list()));
  avg_expense = computed(() => this.avg(this.expense_list()));
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
    // Listen to real-time updates from Firestore
    onSnapshot(this.expensesCollection, (snapshot) => {
      const expenses = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Expense,
      );
      this.expense_list.set(expenses);
    });

    // Listen to categories
    onSnapshot(this.categoriesCollection, (snapshot) => {
      const cats = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Category,
      );
      this.categories.set(cats);
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
      await addDoc(this.expensesCollection, {
        title: name,
        amount: amt,
        category: category,
      });
    } catch (error) {
      console.error('Error adding expense: ', error);
    }
  }

  async updateExpense(id: string, name: string, amt: number, category: string) {
    try {
      const docRef = doc(this.expensesCollection, id);
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
      const docRef = doc(this.expensesCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting expense: ', error);
    }
  }

  async addCategory(name: string, color: string) {
    try {
      await addDoc(this.categoriesCollection, {
        name: name,
        color: color,
      });
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  }
}
