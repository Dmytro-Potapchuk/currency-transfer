import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { getTransactions, TransactionFromAPI } from "../../services/api";
import i18n from "../../i18n";

const TransactionList = () => {
    const { t } = useTranslation();

    const [transactions, setTransactions] = useState<TransactionFromAPI[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTransactions();

                if (Array.isArray(data)) {
                    setTransactions(data);

                } else {
                    console.error("TransactionList: getTransactions вернул не массив:", data);
                    setError(t('errorTransactions')); // Используем ключ для ошибки
                    setTransactions([]);
                }
            } catch (err: any) {
                console.error("TransactionList: Ошибка при загрузке транзакций:", err);
                setError(err?.message || t('errorTransactions')); // Используем ключ для ошибки
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [t]);

    if (loading) {

        return <p style={{ textAlign: 'center', padding: '20px' }}>{t('loadingTransactions')}</p>;
    }

    if (error) {

        return <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</p>;
    }

    if (transactions.length === 0) {

        return <p style={{ textAlign: 'center', padding: '20px' }}>{t('noTransactions')}</p>;
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <h2 style={{ marginBottom: '15px', fontSize: '1.5em', color: '#333' }}>{t('transactionsHistoryTitle')}</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {transactions.map((transaction) => (
                    <li
                        key={transaction.id}
                        style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '15px',
                            marginBottom: '10px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: transaction.amount >= 0 ? '#28a745' : '#dc3545' }}>
                                {/* TODO: Логика +/- для суммы в зависимости от перспективы пользователя */}
                                {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)} {transaction.currencyCode}
                            </span>
                            <span style={{ fontSize: '0.9em', color: '#6c757d' }}>
                                {new Date(transaction.timestamp).toLocaleString(i18n.language, { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.95em', color: '#495057', marginBottom: '5px' }}>
                            <strong>{t('transactionTypeLabel')}:</strong> {transaction.type} {/* Переводим 'Тип:' */}
                        </div>
                        {transaction.description && (
                            <div style={{ fontSize: '0.95em', color: '#495057', marginBottom: '5px' }}>
                                <strong>{t('transactionDescriptionLabel')}:</strong> {transaction.description} {/* Переводим 'Описание:' */}
                            </div>
                        )}
                        <div style={{ fontSize: '0.85em', color: '#6c757d' }}>
                            <span>{t('transactionFromAccountLabel')}: {transaction.fromAccountId}</span> {/* Переводим */}
                            <span style={{ margin: '0 10px' }}>&rarr;</span>
                            <span>{t('transactionToAccountLabel')}: {transaction.toAccountId}</span> {/* Переводим */}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export {TransactionList};