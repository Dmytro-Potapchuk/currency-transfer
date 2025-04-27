import { useState } from "react";
import { sendMoney, receiveMoney } from "../services/api";
import { Notification } from "./Notification";

export const TransferForm = () => {
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState("USD");
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const handleSend = async () => {
        try {
            await sendMoney({ receiver, amount, currency });
            setNotification({ message: "Money sent successfully!", type: "success" });
        } catch (error) {
            setNotification({ message: "Error sending money. Please try again.", type: "error" });
        }
    };

    const handleReceive = async () => {
        try {
            await receiveMoney({ receiver, amount, currency });
            setNotification({ message: "Money received successfully!", type: "success" });
        } catch (error) {
            setNotification({ message: "Error receiving money. Please try again.", type: "error" });
        }
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <div className="transfer-form">
            <h2>Transfer Money</h2>
            <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Receiver"
                className="input-field"
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
                placeholder="Amount"
                className="input-field"
            />
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
            >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="UAH">UAH</option>
            </select>
            <div className="button-container">
                <button onClick={handleSend} className="transfer-button">Send</button>
                <button onClick={handleReceive} className="transfer-button">Receive</button>
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
        </div>
    );
};
