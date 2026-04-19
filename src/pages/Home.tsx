import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/react';
import { useState, useEffect } from 'react';
import {
  ellipsisHorizontal
} from 'ionicons/icons';
import './Home.css';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
}

const Home: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  useEffect(() => {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      setExpenses(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (title: string, amount: number, category: string) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amount,
      category,
      date: new Date()
    };
    setExpenses([newExpense, ...expenses]);
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>My Finances</IonTitle>
          <IonButton slot="end" fill="clear" color="dark">
            <IonIcon icon={ellipsisHorizontal} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="home-container">

          <div className="header-section">
            <h1>Total Expenses</h1>
            <p className="total-balance">{formatCurrency(totalExpenses)}</p>
          </div>

          <ExpenseForm onAdd={addExpense} />
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;