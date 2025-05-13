import React, { useEffect, useState } from "react"; // Dodaj React, jeśli go nie ma
import { getTransactions_OLD as getTransactions } from "../services/api"; // Zmieniony import z aliasem

// Załóżmy, że stary endpoint zwracał tablicę stringów lub obiektów
// Jeśli zwracał obiekty, zdefiniuj dla nich interfejs
interface OldTransaction {
    // Przykładowe pola, dostosuj do tego, co zwracał stary endpoint /transfer/transactions
    id: number | string;
    description: string;
    amount: number;
    currency: string;
    type: 'send' | 'receive'; // Przykład
    timestamp: string;
}

export const TransactionList = () => {
    const [transactions, setTransactions] = useState<OldTransaction[]>([]); // Zmień typ, jeśli trzeba
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getTransactions(); // Używamy aliasowanej funkcji
                // Dostosuj to do struktury danych zwracanej przez stary endpoint
                // Poniżej jest tylko przykład
                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else if (response.data && Array.isArray(response.data.transactions)) { // Może dane są zagnieżdżone
                    setTransactions(response.data.transactions);
                } else {
                    console.warn("Unexpected data structure for transactions:", response.data);
                    setTransactions([]);
                }
            } catch (err: any) {
                console.error("Failed to fetch transactions:", err);
                setError(err.response?.data?.message || "Failed to load transactions.");
            } finally {
                setLoading(false);
            }
        };

        // Na razie zakładamy, że transakcje są pobierane od razu.
        // W nowej wersji będziemy to robić po zalogowaniu i dla konkretnego użytkownika/konta.
        // Aby to działało teraz (tymczasowo), musisz mieć działający (i być może niezabezpieczony)
        // endpoint /transfer/transactions w swoim API.
        if (localStorage.getItem('authToken')) { // Proste sprawdzenie, czy jest token
             fetchTransactions();
        } else {
            setError("Please log in to see transactions."); // Komunikat, jeśli nie ma tokenu
            setLoading(false);
        }
    }, []);

    if (loading) return <p>Loading transactions...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="transaction-list-container" style={{ marginTop: '30px', padding: '15px', border: '1px solid #eee' }}>
            <h2>Transaction History (Legacy)</h2>
            {transactions.length > 0 ? (
                <ul>
                    {transactions.map((transaction, index) => (
                        // Użyj unikalnego ID z transakcji jako klucza, jeśli jest dostępne
                        <li key={transaction.id || index}>
                            {/* Dostosuj wyświetlanie do struktury OldTransaction */}
                            <span>ID: {transaction.id} - </span>
                            <span>{transaction.description || `Transaction ${transaction.type}`}</span>:
                            <span> {transaction.amount} {transaction.currency}</span>
                            <span> ({new Date(transaction.timestamp).toLocaleString()})</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
};