import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";

export const TransactionList = () => {
    const [transactions, setTransactions] = useState<string[]>([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const response = await getTransactions();
        setTransactions(response.data);
    };

    return (
        <div>
            <h2>Transactions</h2>
            <ul>
                {transactions.map((t, i) => (
                    <li key={i}>{t}</li>
                ))}
            </ul>
        </div>
    );
};
