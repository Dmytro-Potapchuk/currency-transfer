import React, { useState, FormEvent } from "react"; // Dodaj React
// Zmienione importy z aliasami
import { sendMoney_OLD as sendMoney } from "../services/api";
// import { Notification } from "./Notification"; // Zakładam, że masz taki komponent

// Prosty komponent Notification dla przykładu, jeśli go nie masz
const Notification: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => {
    if (!message) return null;
    return (
        <div style={{
            padding: '10px',
            margin: '10px 0',
            color: 'white',
            backgroundColor: type === 'success' ? 'green' : 'red',
            borderRadius: '5px'
        }}>
            {message}
        </div>
    );
};


export const TransferForm = () => {
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState<string | number>(""); // Może być stringiem z inputa
    const [currency, setCurrency] = useState("USD"); // Domyślna waluta
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isSending, setIsSending] = useState(false);

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        if (!receiver || !amount || !currency || Number(amount) <= 0) {
            setNotification({ message: "Please fill all fields correctly. Amount must be positive.", type: 'error' });
            return;
        }
        setIsSending(true);
        setNotification(null);
        try {
            // Ta funkcja używa starego endpointu /transfer/send
            // Będzie wymagała autoryzacji, jeśli tak skonfigurowałeś stary backend
            await sendMoney({
                receiver,
                amount: Number(amount),
                currency,
            });
            setNotification({ message: "Money sent successfully (using legacy endpoint)!", type: 'success' });
            // Wyczyść formularz
            setReceiver("");
            setAmount("");
        } catch (error: any) {
            console.error("Send money error:", error);
            setNotification({ message: error.response?.data?.message || "Failed to send money.", type: 'error' });
        } finally {
            setIsSending(false);
        }
    };


    return (
        <div className="transfer-form-container" style={{ flexBasis: '48%', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h2>Send/Receive Money (Legacy Form)</h2>
            {notification && <Notification message={notification.message} type={notification.type} />}
            <form onSubmit={handleSend}>
                <div>
                    <label htmlFor="receiver">Receiver:</label>
                    <input
                        id="receiver"
                        type="text"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                        placeholder="Receiver's identifier"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount_transfer">Amount:</label>
                    <input
                        id="amount_transfer"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="currency_transfer">Currency:</label>
                    <select
                        id="currency_transfer"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="PLN">PLN</option>
                        {/* Dodaj więcej walut, jeśli potrzebujesz */}
                    </select>
                </div>
                <div className="button-container">
                    <button type="submit" disabled={isSending}>
                        {isSending ? "Sending..." : "Send Money"}
                    </button>
                </div>
            </form>
            <p style={{fontSize: '0.8em', color: 'gray', marginTop: '15px'}}>
                Note: This form uses legacy endpoints. It will be updated to use the new account-based transfer system.
            </p>
        </div>
    );
};