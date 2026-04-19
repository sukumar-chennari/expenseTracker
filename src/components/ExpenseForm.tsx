import {
    IonInput,
    IonButton,
    IonIcon,
    IonAlert,
    IonToast,
    IonSelect,
    IonSelectOption,
    IonSpinner
} from '@ionic/react';
import { addOutline, micOutline, micOffOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';

interface Props {
    onAdd: (title: string, amount: number, category: string) => void;
}

// Type definitions for Web Speech API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isListening, setIsListening] = useState(false);

    const titleRef = useRef<HTMLIonInputElement>(null);

    const handleAdd = () => {
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

        onAdd(title.trim(), parseFloat(amount), category.trim() || 'Other');

        setTitle('');
        setAmount('');
        setCategory('');
        setToastMsg('Expense added successfully!');
        setShowToast(true);

        setTimeout(() => {
            titleRef.current?.setFocus();
        }, 100);
    };

    const startVoiceInput = () => {
        if (!SpeechRecognition) {
            setErrorMsg('Speech recognition is not supported in this browser.');
            setShowAlert(true);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => {
            setErrorMsg('Could not access microphone.');
            setShowAlert(true);
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            parseVoiceInput(transcript);
        };

        recognition.start();
    };

    const parseVoiceInput = (text: string) => {
        // 1. Extract amount (e.g., "Spent 200 on food")
        const amountMatch = text.match(/\d+(\.\d+)?/);
        if (amountMatch) {
            setAmount(amountMatch[0]);
        }

        // 2. Extract category based on keywords
        if (text.includes('food') || text.includes('eat') || text.includes('lunch') || text.includes('grocery')) {
            setCategory('Food');
        } else if (text.includes('bill') || text.includes('rent') || text.includes('electricity')) {
            setCategory('Bills');
        } else if (text.includes('travel') || text.includes('bus') || text.includes('fuel') || text.includes('gas') || text.includes('transport')) {
            setCategory('Transport');
        } else if (text.includes('shopping') || text.includes('buy') || text.includes('clothes')) {
            setCategory('Shopping');
        } else {
            setCategory('Other');
        }

        // 3. Extract title (optionally the whole phrase as a start)
        setTitle(text);

        setToastMsg(`Parsed: "${text}"`);
        setShowToast(true);
    };

    return (
        <div className="form-card">
            <div className="form-header-row">
                <h2 className="form-header">Add Transaction</h2>
                <IonButton
                    fill="clear"
                    onClick={startVoiceInput}
                    className={`mic-btn ${isListening ? 'listening' : ''}`}
                    disabled={isListening}
                >
                    {isListening ? (
                        <IonSpinner name="bubbles" color="primary" />
                    ) : (
                        <IonIcon icon={micOutline} color="primary" />
                    )}
                </IonButton>
            </div>

            {isListening && <p className="listening-prompt">Listening...</p>}

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
                header="Wait a sec"
                message={errorMsg}
                buttons={['OK']}
            />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMsg}
                duration={3000}
                color="success"
                position="top"
            />
        </div>
    );
};

export default ExpenseForm;