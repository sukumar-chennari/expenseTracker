import {
    IonList,
    IonItem,
    IonButton,
    IonIcon,
    IonAlert
} from '@ionic/react';
import {
    trashOutline,
    walletOutline,
    fastFoodOutline,
    busOutline,
    receiptOutline,
    cartOutline
} from 'ionicons/icons';
import { useState } from 'react';

interface Expense {
    id: string;
    title: string;
    amount: number;
    category: string;
}

interface Props {
    expenses: Expense[];
    onDelete: (id: string) => void;
}

const ExpenseList: React.FC<Props> = ({ expenses, onDelete }) => {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const getCategoryIcon = (cat: string) => {
        switch (cat?.toLowerCase()) {
            case 'food': return fastFoodOutline;
            case 'transport': return busOutline;
            case 'bills': return receiptOutline;
            case 'shopping': return cartOutline;
            default: return walletOutline;
        }
    };

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            onDelete(selectedId);
            setSelectedId(null);
        }
    };

    if (expenses.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon-wrapper">
                    <IonIcon icon={walletOutline} />
                </div>
                <h3>No transactions yet</h3>
                <p>Your spending history will appear here once you add your first expense.</p>
            </div>
        );
    }

    return (
        <div className="list-section">
            <div className="list-header">
                <h2>Recent History</h2>
                <IonButton fill="clear" size="small" color="primary">View All</IonButton>
            </div>

            <IonList lines="none" style={{ background: 'transparent' }}>
                {expenses.map((expense) => (
                    <IonItem key={expense.id} className="expense-item">
                        <div className="expense-card">
                            <div className="item-left">
                                <div className="icon-box">
                                    <IonIcon icon={getCategoryIcon(expense.category)} />
                                </div>
                                <div className="item-info">
                                    <span className="item-title">{expense.title}</span>
                                    <span className="item-category">{expense.category}</span>
                                </div>
                            </div>
                            <div className="item-right">
                                <span className="item-amount">-{formatCurrency(expense.amount)}</span>
                                <IonButton
                                    fill="clear"
                                    color="danger"
                                    onClick={() => handleDeleteClick(expense.id)}
                                    className="delete-btn"
                                >
                                    <IonIcon slot="icon-only" icon={trashOutline} />
                                </IonButton>
                            </div>
                        </div>
                    </IonItem>
                ))}
            </IonList>

            <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header="Confirm Delete"
                message="Are you sure you want to delete this expense?"
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => setSelectedId(null)
                    },
                    {
                        text: 'Delete',
                        role: 'destructive',
                        handler: confirmDelete
                    }
                ]}
            />
        </div>
    );
};

export default ExpenseList;