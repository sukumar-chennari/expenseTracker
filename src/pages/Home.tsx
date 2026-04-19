import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonActionSheet,
  IonToast
} from '@ionic/react';
import { useState, useEffect, useMemo } from 'react';
import {
  ellipsisHorizontal,
  sunnyOutline,
  moonOutline,
  trashOutline,
  colorPaletteOutline,
  eyeOutline
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
  const [showMenu, setShowMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Dark Mode State
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  // Thoughtful Touch: Dynamic Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: sunnyOutline };
    if (hour < 18) return { text: 'Good Afternoon', icon: sunnyOutline };
    return { text: 'Good Evening', icon: moonOutline };
  }, []);

  // Thoughtful Touch: Category Summary
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

  const handleViewAll = () => {
    setToastMsg(`Currently viewing all ${expenses.length} transactions.`);
    setShowToast(true);
  };

  const clearAll = () => {
    setExpenses([]);
    setToastMsg('All transactions cleared.');
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>
            <div className="brand-wrapper">
              <span>Expense Tracker</span>
            </div>
          </IonTitle>
          <IonButton 
            slot="end" 
            fill="clear" 
            onClick={() => setShowMenu(true)}
          >
            <IonIcon icon={ellipsisHorizontal} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="home-container">

          <div className="header-section">
            {expenses.length === 0 ? (
              <div className="welcome-hero animate-fade-in">
                <div className="greeting-pill">
                  <IonIcon icon={greeting.icon} />
                  <span>{greeting.text}</span>
                </div>
                <h1>Track your spending <br/>with ease.</h1>
                <p className="hero-subtitle">Smart way to manage your daily expenses and save more for your future.</p>
              </div>
            ) : (
              <div className="active-dashboard animate-fade-in">
                <p className="section-label">Total Expenses</p>
                <h1 className="total-balance">{formatCurrency(totalExpenses)}</h1>
                
                {topCategory && (
                  <div className="category-insight">
                    <IonBadge color="primary" className="insight-badge">
                      Most spent on: {topCategory.name}
                    </IonBadge>
                  </div>
                )}
              </div>
            )}
          </div>

          <ExpenseForm onAdd={addExpense} />
          
          <div className="list-section">
            <div className="list-header">
              <h2>Recent History</h2>
              <IonButton 
                fill="clear" 
                size="small" 
                color="primary"
                onClick={handleViewAll}
              >
                View All
              </IonButton>
            </div>
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>

        </div>

        <IonActionSheet
          isOpen={showMenu}
          onDidDismiss={() => setShowMenu(false)}
          header="Options"
          buttons={[
            {
              text: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
              icon: isDark ? sunnyOutline : moonOutline,
              handler: () => setIsDark(!isDark)
            },
            {
              text: 'Clear All History',
              role: 'destructive',
              icon: trashOutline,
              handler: clearAll
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={2000}
          position="bottom"
          color="dark"
        />
      </IonContent>
    </IonPage>
  );
};


export default Home;