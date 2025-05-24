
import React, { useState, useEffect, FormEvent } from "react";
import { useTranslation } from 'react-i18next';
import { createTransfer, getMyAccounts, createAccount, UserAccount as ApiUserAccount } from "../../services/api";
import { Notification } from "../Notification";


interface UserAccount extends ApiUserAccount {}

interface CreateTransferApiPayload {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    description?: string;
}

const TransferForm = () => {
    const { t } = useTranslation();

    const [myAccounts, setMyAccounts] = useState<UserAccount[]>([]);
    const [selectedFromAccountId, setSelectedFromAccountId] = useState<string>("");
    const [receiverAccountIdStr, setReceiverAccountIdStr] = useState("");
    const [amountStr, setAmountStr] = useState("");
    const [displayCurrencyCode, setDisplayCurrencyCode] = useState("USD");
    const [description, setDescription] = useState("");
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const fetchAndSetAccounts = async () => {
        try {

            const accountsData: UserAccount[] | null = await getMyAccounts();


            if (Array.isArray(accountsData) && accountsData.length > 0) {
                setMyAccounts(accountsData);
                setSelectedFromAccountId(accountsData[0].id.toString());
                setDisplayCurrencyCode(accountsData[0].currencyCode);
            } else {
                setMyAccounts([]);
                setSelectedFromAccountId("");
                setDisplayCurrencyCode("---");
            }
        } catch (error) {
            console.error("TransferForm: Ошибка при загрузке счетов:", error);
            setNotification({ message: t('errorLoadingAccounts'), type: "error" });
            setMyAccounts([]);
            setSelectedFromAccountId("");
        }
    };

    useEffect(() => {
        fetchAndSetAccounts();
    }, [t]);

    const handleQuickCreateAccount = async (currCode: string) => {
        try {
            // Используем ключ и передаем параметр currencyCode для интерполяции
            setNotification({ message: t('creatingAccountIn', { currencyCode: currCode }), type: "success" });
            const newAccountData = await createAccount({ currencyCode: currCode });
            console.log("Создан новый счет (ответ от API POST /Accounts):", newAccountData);
            setNotification({ message: t('accountCreatedUpdateList', { currencyCode: currCode }), type: "success" });
            await fetchAndSetAccounts();
        } catch (error) {
            console.error("Ошибка при быстром создании счета:", error);
            setNotification({ message: t('errorCreatingAccount'), type: "error"});
        }
    };

    const handleSubmitTransfer = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setNotification(null);

        const amount = parseFloat(amountStr);
        const toAccountId = parseInt(receiverAccountIdStr, 10);
        const fromAccountIdNumber = parseInt(selectedFromAccountId, 10);

        if (isNaN(fromAccountIdNumber) || fromAccountIdNumber <= 0) {
            setNotification({ message: t('errorSelectDebitAccount'), type: "error" });
            return;
        }
        if (isNaN(toAccountId) || toAccountId <= 0) {
            setNotification({ message: t('errorReceiverAccountIdNumeric'), type: "error" });
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            setNotification({ message: t('errorAmountPositive'), type: "error" });
            return;
        }
        if (!description.trim()) { // Сделаем описание обязательным для примера
            setNotification({ message: t('errorDescriptionRequired'), type: "error" });
            return;
        }

        if (fromAccountIdNumber === toAccountId) {
            setNotification({ message: t('errorSameAccounts'), type: "error" });
            return;
        }

        const transferPayloadForApi: CreateTransferApiPayload = {
            fromAccountId: fromAccountIdNumber,
            toAccountId: toAccountId,
            amount,
            description: description.trim(),
        };


        try {
            const response = await createTransfer(transferPayloadForApi);
            console.log("Transfer API response:", response);

            setNotification({ message: t('transferSuccessWithId', { transactionId: response?.transactionId || 'N/A' }), type: "success" });
            setReceiverAccountIdStr("");
            setAmountStr("");
            setDescription("");
            await fetchAndSetAccounts();
        } catch (error: any) {
            console.error("Transfer failed:", error);
            // handleError в api.ts покажет alert, но мы можем использовать и setNotification
            // Сообщения об ошибках от API (например, "Insufficient funds") уже должны переводиться в handleError,
            // если они там обернуты в t() или если handleError возвращает ключ, а мы здесь его переводим.
            // Пока оставим как есть, так как handleError показывает alert.
            // Если хочешь кастомное сообщение из setNotification, нужно будет его перевести:
            // const backendErrorMessage = error?.response?.data?.message || error?.response?.data?.title || ...
            // setNotification({ message: t(backendErrorMessage) или t('errorDefaultTransfer'), type: "error" });
            setNotification({ message: error?.response?.data?.message || t('errorDefaultTransfer'), type: "error" });
        }
    };

    const closeNotification = () => { setNotification(null); };

    return (
        <div style={{ width: "100%", maxWidth: "450px", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", marginTop: "20px" }}>
            <h2>{t('createTransferTitle')}</h2> {/* Ключ из i18n.js */}
            {notification && ( <Notification message={notification.message} type={notification.type} onClose={closeNotification} /> )}

            {myAccounts.length === 0 && (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <p style={{margin: '0 0 10px 0'}}>{t('noAccountsPrompt')}</p> {/* Ключ */}
                    <button type="button" onClick={() => handleQuickCreateAccount("USD")} style={{marginRight: '10px', padding: '8px'}}>{t('createUsdAccount')}</button> {/* Ключ */}
                    <button type="button" onClick={() => handleQuickCreateAccount("EUR")} style={{marginRight: '10px', padding: '8px'}}>{t('createEurAccount')}</button> {/* Ключ */}
                    <button type="button" onClick={() => handleQuickCreateAccount("UAH")} style={{padding: '8px'}}>{t('createUahAccount')}</button> {/* Ключ */}
                </div>
            )}

            <form onSubmit={handleSubmitTransfer}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="fromAccount" style={{ display: 'block', marginBottom: '5px' }}>{t('fromAccountLabel')}:</label> {/* Ключ */}
                    <select
                        id="fromAccount"
                        value={selectedFromAccountId}
                        onChange={(e) => {
                            const accountIdStr = e.target.value;
                            setSelectedFromAccountId(accountIdStr);
                            const selectedAccount = myAccounts.find(acc => acc.id.toString() === accountIdStr);
                            if (selectedAccount) {
                                setDisplayCurrencyCode(selectedAccount.currencyCode);
                            }
                        }}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                        disabled={myAccounts.length === 0}
                    >
                        <option value="" disabled>{t('selectAccountPlaceholder')}</option> {/* Ключ */}
                        {myAccounts.map(account => (
                            <option key={account.id} value={account.id.toString()}>
                                {t('accountDisplay', { id: account.id, balance: account.balance.toFixed(2), currencyCode: account.currencyCode })} {/* Ключ с интерполяцией */}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="receiverAccId" style={{ display: 'block', marginBottom: '5px' }}>{t('receiverAccountIdLabel')}:</label> {/* Ключ */}
                    <input
                        id="receiverAccId"
                        type="number"
                        value={receiverAccountIdStr}
                        onChange={(e) => setReceiverAccountIdStr(e.target.value)}
                        placeholder={t('receiverAccountPlaceholder')}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="transferAmount" style={{ display: 'block', marginBottom: '5px' }}>{t('transferAmountLabel')}:</label> {/* Ключ (или amountLabel) */}
                    <input id="transferAmount" type="number" value={amountStr} onChange={(e) => setAmountStr(e.target.value)} placeholder={t('amountLabel')} required step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="displayCurrency" style={{ display: 'block', marginBottom: '5px' }}>{t('debitAccountCurrencyLabel')}:</label> {/* Ключ */}
                    <input id="displayCurrency" type="text" value={displayCurrencyCode} readOnly style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#e9ecef' }}/>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="transferDescription" style={{ display: 'block', marginBottom: '5px' }}>{t('descriptionLabel')}:</label> {/* Ключ */}
                    <input id="transferDescription" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('descriptionPlaceholder')} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}/> {/* Убрал required, т.к. Description на бэке nullable */}
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} disabled={!selectedFromAccountId}>
                    {t('performTransferButton')} {/* Ключ */}
                </button>
            </form>
        </div>
    );
};

export {TransferForm};