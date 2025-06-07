import React, { useEffect, useState } from 'react';
import { adminGetAllAccounts, adminGetAllTransactions, adminDeleteAccount, adminDeleteTransaction, UserAccount, TransactionFromAPI } from '../../services/api';

const AdminDashboard: React.FC = () => {
    const [accounts, setAccounts] = useState<UserAccount[]>([]);
    const [transactions, setTransactions] = useState<TransactionFromAPI[]>([]);

    const fetchData = async () => {
        try {
            const accs = await adminGetAllAccounts();
            const trans = await adminGetAllTransactions();
            setAccounts(accs);
            setTransactions(trans);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccountDelete = async (accountId: number) => {
        try {
            await adminDeleteAccount(accountId);
            alert('Konto usunięte!');
            fetchData(); // Odśwież dane
        } catch (error) { /* Błąd lub anulowanie */ }
    };

    const handleTransactionDelete = async (transactionId: number) => {
        try {
            await adminDeleteTransaction(transactionId);
            alert('Transakcja usunięta!');
            fetchData(); // Odśwież dane
        } catch (error) { /* Błąd lub anulowanie */ }
    };

    return (
        <div>
            <h1>Panel Administratora</h1>

            <h2>Wszystkie Konta</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>ID Konta</th>
                    <th>ID Użytkownika</th>
                    <th>Waluta</th>
                    <th>Saldo</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {accounts.map(acc => (
                    <tr key={acc.id}>
                        <td>{acc.id}</td>
                        <td>{acc.userId}</td>
                        <td>{acc.currencyCode}</td>
                        <td>{acc.balance}</td>
                        <td>
                            <button>Edytuj</button>
                            <button onClick={() => handleAccountDelete(acc.id)}>Usuń</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2 style={{ marginTop: '40px' }}>Wszystkie Transakcje</h2>
            {/* Tutaj podobna tabela dla transakcji */}
        </div>
    );
};

export default AdminDashboard;
