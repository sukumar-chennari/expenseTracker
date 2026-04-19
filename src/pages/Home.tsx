import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonBadge
} from '@ionic/react';
import { useState, useEffect, useMemo } from 'react';
import {
  ellipsisHorizontal,
  sunnyOutline,
  moonOutline,
  cloudyNightOutline
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

  // 1. Thoughtful Touch: Dynamic Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: sunnyOutline };
    if (hour < 18) return { text: 'Good Afternoon', icon: sunnyOutline };
    return { text: 'Good Evening', icon: moonOutline };
  }, []);

  // 2. Thoughtful Touch: Category Summary
  const topCategory = useMemo(() => {
    if (expenses.length === 0) return null;
    const totals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const top = Object.entries(totals).reduce((a, b) => a[1] > b[1] ? a : b);
    return { name: top[0], amount: top[1] };
  }, [expenses]);

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
          <IonTitle>
            <div className="title-wrapper">
              <IonIcon icon={greeting.icon} className="greeting-icon" />
              <span>{greeting.text}</span>
            </div>
          </IonTitle>
          <IonButton slot="end" fill="clear" color="dark">
            <IonIcon icon={ellipsisHorizontal} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="home-container">

          <div className="header-section">
            <p className="section-label">Total Expenses</p>
            <h1 className="total-balance">{formatCurrency(totalExpenses)}</h1>
            
            {topCategory && (
              <div className="cateogry-insight animate-fade-in">
                <IonBadge color="primary" className="insight-badge">
                  Most spent on: {topCategory.name}
                </IonBadge>
              </div>
            )}
          </div>

          <ExpenseForm onAdd={addExpense} />
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;