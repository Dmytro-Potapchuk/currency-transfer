// src/components/DepositForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { getMyAccounts, UserAccount, createPayUPayment, CreatePayUPaymentResponse } from '../../services/api';
import { Notification } from '../Notification';

const DepositForm = () => {
    const { t } = useTranslation();
    const [myAccounts, setMyAccounts] = useState<UserAccount[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [amountStr, setAmountStr] = useState('');
    const [description, setDescription] = useState('Account Deposit');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentResponse, setPaymentResponse] = useState<CreatePayUPaymentResponse | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const accounts = await getMyAccounts();
                if (Array.isArray(accounts)) {
                    setMyAccounts(accounts);
                    if (accounts.length > 0) {
                        setSelectedAccountId(accounts[0].id.toString());
                    }
                }
            } catch (error) {
                console.error("Failed to fetch accounts for deposit:", error);
                setNotification({ message: t('errorLoadingAccounts'), type: 'error' });
            }
        };
        fetchAccounts();
    }, [t]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setNotification(null);
        setPaymentResponse(null);
        setIsLoading(true);

        const amount = parseFloat(amountStr);
        const accountIdNum = parseInt(selectedAccountId, 10);

        if (!selectedAccountId || isNaN(accountIdNum)) {
            setNotification({ message: t('errorSelectAccount'), type: 'error' }); // errorSelectAccount: "Please select an account."
            setIsLoading(false);
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            setNotification({ message: t('errorAmountPositive'), type: 'error' });
            setIsLoading(false);
            return;
        }

        const selectedAccount = myAccounts.find(acc => acc.id === accountIdNum);
        if (!selectedAccount) {
            setNotification({ message: t('errorAccountNotFound'), type: 'error' }); // errorAccountNotFound: "Selected account not found."
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                accountId: accountIdNum,
                amount,
                currencyCode: selectedAccount.currencyCode, // Użyj waluty wybranego konta
                description
            };
            const response = await createPayUPayment(payload);
            setPaymentResponse(response);
            if (response.success && response.redirectUri) {
                // Symulacja przekierowania: zamiast window.location.href, wyświetlimy link
                setNotification({ message: t('paymentInitializedRedirect', { orderId: response.orderId }), type: 'success' });
                // paymentInitializedRedirect: "Payment initialized (Order ID: {{orderId}}). Click the link below or you would be redirected."
            } else {
                setNotification({ message: response.errorMessage || t('errorPaymentInit'), type: 'error' });
                // errorPaymentInit: "Failed to initialize payment."
            }
        } catch (error: any) {
            const apiError = error?.response?.data?.message || error?.message || t('errorPaymentInit');
            setNotification({ message: apiError, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "450px", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", marginTop: "20px" }}>
            <h3>{t('depositFundsTitle')}</h3> {/* depositFundsTitle: "Deposit Funds (PayU Simulation)" */}
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="depositAccount">{t('depositToAccountLabel')}:</label> {/* depositToAccountLabel: "Deposit to Account:" */}
                    <select
                        id="depositAccount"
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        disabled={myAccounts.length === 0}
                    >
                        <option value="" disabled>{t('selectAccountPlaceholder')}</option>
                        {myAccounts.map(account => (
                            <option key={account.id} value={account.id.toString()}>
                                {t('accountDisplay', { id: account.id, balance: account.balance.toFixed(2), currencyCode: account.currencyCode })}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="depositAmount">{t('depositAmountLabel')}:</label> {/* depositAmountLabel: "Amount to Deposit:" */}
                    <input
                        id="depositAmount"
                        type="number"
                        value={amountStr}
                        onChange={(e) => setAmountStr(e.target.value)}
                        placeholder={t('amountLabel')}
                        required
                        step="0.01"
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="depositDescription">{t('depositDescriptionLabel')}:</label> {/* depositDescriptionLabel: "Description:" */}
                    <input
                        id="depositDescription"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('depositDescriptionPlaceholder')} // depositDescriptionPlaceholder: "e.g., Monthly top-up"
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {isLoading ? t('processingLabel') : t('initiateDepositButton')} {/* processingLabel: "Processing...", initiateDepositButton: "Initiate Deposit" */}
                </button>
            </form>

            {paymentResponse && paymentResponse.success && paymentResponse.redirectUri && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>
                    <p>{t('mockRedirectPrompt')}</p> {/* mockRedirectPrompt: "In a real scenario, you would be redirected. For this simulation, click the link or navigate to:" */}
                    {/* Frontend powinien mieć specjalną stronę /payment-status?orderId=...&status=... */}
                    <a href={paymentResponse.redirectUri}
                       onClick={(e) => {
                           e.preventDefault();
                           // Zamiast faktycznego przekierowania, nawiguj w React Router
                           // navigate(`/payment-status?orderId=${paymentResponse.orderId}`);
                           // Albo po prostu otwórz w nowej karcie dla testu
                           window.open(paymentResponse.redirectUri, "_blank");
                           setNotification({ message: t('checkingPaymentStatus', { orderId: paymentResponse.orderId }), type: 'success'});
                           // checkingPaymentStatus: "Simulating redirect and checking payment status for Order ID: {{orderId}}"
                       }}
                       target="_blank" rel="noopener noreferrer"
                    >
                        {paymentResponse.redirectUri}
                    </a>
                    <p>{t('checkStatusManuallyPrompt')}</p> {/* checkStatusManuallyPrompt: "You can also manually check status for this order on a dedicated page." */}
                </div>
            )}
        </div>
    );
};

export default DepositForm;