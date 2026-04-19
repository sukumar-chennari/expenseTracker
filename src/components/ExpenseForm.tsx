import {
    IonInput,
    IonButton,
    IonIcon,
    IonAlert,
    IonToast,
    IonSelect,
    IonSelectOption
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';

interface Props {
    onAdd: (title: string, amount: number, category: string) => void;
}

const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const titleRef = useRef<HTMLIonInputElement>(null);

    const handleAdd = () => {
        // 1. Validation
        if (!title.trim()) {
            setErrorMsg('Please enter a description for your expense.');
            setShowAlert(true);
            return;
        }
        if (!amount || Number(amount) <= 0) {
            setErrorMsg('Please enter a valid amount greater than zero.');
            setShowAlert(true);
            return;
        }

        // 2. Add Expense
        onAdd(title.trim(), parseFloat(amount), category.trim() || 'General');

        // 3. Reset & Toast
        setTitle('');
        setAmount('');
        setCategory('');
        setShowToast(true);

        // 4. Focus back to title
        setTimeout(() => {
            titleRef.current?.setFocus();
        }, 100);
    };

    return (
        <div className="form-card">
            <h2 className="form-header">Add Transaction</h2>
            <div className="input-group">
                <IonInput
                    className="custom-input"
                    placeholder="What did you buy?"
                    value={title}
                    ref={titleRef}
                    onIonChange={(e) => setTitle(e.detail.value!)}
                />
                <IonInput
                    className="custom-input"
                    placeholder="How much? (e.g. 50.00)"
                    type="number"
                    value={amount}
                    onIonChange={(e) => setAmount(e.detail.value!)}
                />
                <IonSelect
                    className="custom-input"
                    placeholder="Select Category"
                    value={category}
                    interface="popover"
                    onIonChange={(e) => setCategory(e.detail.value)}
                >
                    <IonSelectOption value="Food">Food</IonSelectOption>
                    <IonSelectOption value="Bills">Bills</IonSelectOption>
                    <IonSelectOption value="Transport">Transport</IonSelectOption>
                    <IonSelectOption value="Shopping">Shopping</IonSelectOption>
                    <IonSelectOption value="Other">Other</IonSelectOption>
                </IonSelect>
            </div>

            <IonButton
                className="add-button"
                expand="block"
                onClick={handleAdd}
            >
                <IonIcon slot="start" icon={addOutline} />
                Add Expense
            </IonButton>

            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="Invalid Input"
                message={errorMsg}
                buttons={['OK']}
            />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message="Expense added successfully!"
                duration={2000}
                color="success"
                position="top"
            />
        </div>
    );
};

export default ExpenseForm;