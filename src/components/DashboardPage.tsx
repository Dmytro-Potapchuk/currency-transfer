import React, { useEffect, useState, FormEvent } from 'react';
import {
    getCurrentUserProfile, fetchUserAccounts, createNewAccount, makeTransfer, logoutUser, AccountResponse,
    fetchAllowedCurrencies, performCurrencyExchange, ExchangeResultWrapper, ExchangeResponse
} from '../services/api';
import { useNavigate } from 'react-router-dom';

interface UserProfile { id: string; username: string; email: string | null; role: string; }

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionError, setActionError] = useState<string | null>(null);
    const [pageError, setPageError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [allowedCurrencies, setAllowedCurrencies] = useState<string[]>([]);
    const [newAccountCurrency, setNewAccountCurrency] = useState<string>('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    const [fromAccountId, setFromAccountId] = useState<string>('');
    const [toAccountId, setToAccountId] = useState<string>('');
    const [transferAmount, setTransferAmount] = useState<string>('');
    const [transferDescription, setTransferDescription] = useState<string>('');
    const [isMakingTransfer, setIsMakingTransfer] = useState(false);

    const [exchangeFromAccountId, setExchangeFromAccountId] = useState<string>('');
    const [exchangeToAccountId, setExchangeToAccountId] = useState<string>('');
    const [amountToExchange, setAmountToExchange] = useState<string>('');
    const [isExchanging, setIsExchanging] = useState(false);
    const [exchangeApiResult, setExchangeApiResult] = useState<ExchangeResultWrapper | null>(null);

    const loadInitialData = async () => {
        setIsLoading(true); setPageError(null);
        try {
            const profilePromise = getCurrentUserProfile();
            const accountsPromise = fetchUserAccounts();
            const allowedCurrenciesPromise = fetchAllowedCurrencies();
            const [profile, userAccounts, currencies] = await Promise.all([profilePromise, accountsPromise, allowedCurrenciesPromise]);
            setUser(profile); setAccounts(userAccounts); setAllowedCurrencies(currencies);
            if (currencies.length > 0 && newAccountCurrency === '') {
                setNewAccountCurrency(currencies[0]);
            }
        } catch (err: any) {
            console.error("Dashboard data fetch error:", err);
            setPageError(err.response?.data?.message || 'Failed to load dashboard data. You might be logged out.');
            if (err.response?.status === 401) handleLogout();
        } finally { setIsLoading(false); }
    };

    useEffect(() => {
        if (!localStorage.getItem('authToken')) navigate('/login'); else loadInitialData();
    }, [navigate]);

    const handleCreateAccountSubmit = async (e: FormEvent) => {
        e.preventDefault(); if (!newAccountCurrency) { setActionError("Please select a currency."); return; }
        setActionError(null); setIsCreatingAccount(true);
        try {
            await createNewAccount({ currencyCode: newAccountCurrency }); alert('Account created successfully!');
            if (allowedCurrencies.length > 0) setNewAccountCurrency(allowedCurrencies[0]);
            await loadInitialData();
        } catch (err: any) { setActionError(err.response?.data?.message || 'Failed to create account.'); console.error("Create account error:", err); }
        finally { setIsCreatingAccount(false); }
    };

    const handleTransferSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!fromAccountId || !toAccountId || !transferAmount || parseFloat(transferAmount) <= 0) {
            setActionError('Please fill all transfer fields correctly. Amount must be positive and accounts selected.'); return;
        }
        setActionError(null); setIsMakingTransfer(true);
        try {
            await makeTransfer({ fromAccountId: parseInt(fromAccountId), toAccountId: parseInt(toAccountId), amount: parseFloat(transferAmount), description: transferDescription });
            alert('Transfer successful!');
            setFromAccountId(''); setToAccountId(''); setTransferAmount(''); setTransferDescription('');
            await loadInitialData();
        } catch (err: any) { setActionError(err.response?.data?.message || 'Transfer failed.'); console.error("Transfer error:", err); }
        finally { setIsMakingTransfer(false); }
    };

    const handleExchangeSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setExchangeApiResult(null); // Resetuj wynik poprzedniej wymiany
        setActionError(null);

        if (!exchangeFromAccountId || !exchangeToAccountId || !amountToExchange || parseFloat(amountToExchange) <= 0) {
            setActionError('Please select source and destination accounts and enter a positive amount to exchange.');
            return;
        }
        const fromAcc = accounts.find(a => a.id === parseInt(exchangeFromAccountId));
        const toAcc = accounts.find(a => a.id === parseInt(exchangeToAccountId));
        if (fromAcc?.currencyCode === toAcc?.currencyCode) {
            setActionError('Source and destination accounts for exchange must have different currencies.');
            return;
        }
        if (exchangeFromAccountId === exchangeToAccountId) {
             setActionError('Source and destination accounts cannot be the same physical account for an exchange.');
            return;
        }
        setIsExchanging(true);
        try {
            const result = await performCurrencyExchange({
                fromAccountId: parseInt(exchangeFromAccountId),
                toAccountId: parseInt(exchangeToAccountId),
                amountToExchange: parseFloat(amountToExchange)
            });
            console.log("API Response for Exchange (in DashboardPage):", result); // Log do sprawdzenia
            setExchangeApiResult(result);

            // Używamy camelCase zgodnie z tym, co logowałeś, że dostajesz
            if (result.success && result.exchangeDetails) {
                alert(`Exchange successful! Debited ${result.exchangeDetails.amountDebited.toFixed(2)} ${result.exchangeDetails.fromCurrency}, Credited ${result.exchangeDetails.amountCredited.toFixed(4)} ${result.exchangeDetails.toCurrency}. Rate: ${result.exchangeDetails.exchangeRate.toFixed(4)}`);
                setExchangeFromAccountId('');
                setExchangeToAccountId('');
                setAmountToExchange('');
                await loadInitialData();
            } else {
                setActionError(result.errorMessage || 'Currency exchange failed (from result object).');
            }
        } catch (err: any) {
            setActionError(err.response?.data?.message || 'Currency exchange failed (from catch block).');
            console.error("Exchange error (in catch block):", err);
            if (err.response) {
                console.log("Error response data (from catch - err.response.data):", err.response.data);
            }
        } finally {
            setIsExchanging(false);
        }
    };

    const handleLogout = () => { logoutUser(); navigate('/login'); };

    if (isLoading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading dashboard...</p>;
    if (pageError) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Error: {pageError} <button onClick={handleLogout}>Go to Login</button></div>;
    if (!user) return <div style={{textAlign: 'center', marginTop: '50px'}}>User data not available. <button onClick={handleLogout}>Go to Login</button></div>;

    return (
        <div className="container">
            <h1 className="title">💸 Currency Transfer App Dashboard</h1>
            <p style={{textAlign: 'center', marginBottom: '20px'}}>Welcome, <strong>{user.username}</strong> (Role: {user.role}) <button onClick={handleLogout} style={{marginLeft: '15px'}}>Logout</button></p>
            {actionError && <p style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '15px', textAlign: 'center' }}>{actionError}</p>}

            <div className="sections">
                <div style={{ flex: 1, padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginRight: '10px' }}>
                    <h3>Your Accounts</h3>
                    {accounts.length > 0 ? (<ul style={{ listStyle: 'none', padding: 0 }}>{accounts.map(acc => (<li key={acc.id} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>ID: {acc.id} | <strong>{acc.currencyCode}</strong> | Balance: {acc.balance.toFixed(2)}</li>))}</ul>)
                    : <p>You don't have any accounts yet.</p>}
                    <form onSubmit={handleCreateAccountSubmit} style={{ marginTop: '20px' }}>
                        <h4>Create New Account</h4>
                        <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="newAccountCurrencySelect" style={{display: 'block', marginBottom: '5px'}}>Currency: </label>
                        <select id="newAccountCurrencySelect" value={newAccountCurrency} onChange={e => setNewAccountCurrency(e.target.value)} required disabled={isLoading || allowedCurrencies.length === 0} style={{ marginRight: '10px', padding: '8px', minWidth: '100px' }}>
                            {allowedCurrencies.length === 0 && !isLoading && <option value="" disabled>No currencies</option>}
                            {allowedCurrencies.length === 0 && isLoading && <option value="" disabled>Loading...</option>}
                            {allowedCurrencies.length > 0 && newAccountCurrency === '' && <option value="" disabled>-- Select Currency --</option> }
                            {allowedCurrencies.map(currency => (<option key={currency} value={currency}>{currency}</option>))}
                        </select>
                        <button type="submit" disabled={isCreatingAccount || !newAccountCurrency}>{isCreatingAccount ? "Creating..." : "Create Account"}</button>
                        </div>
                    </form>
                </div>
                <div style={{ flex: 1, padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginLeft: '10px' }}>
                    <h3>Make a Transfer</h3>
                    <form onSubmit={handleTransferSubmit}>
                        <div style={{ marginBottom: '10px' }}><label htmlFor="fromAccount" style={{display: 'block', marginBottom: '5px'}}>From Account: </label><select id="fromAccount" value={fromAccountId} onChange={e => setFromAccountId(e.target.value)} required><option value="">-- Select Source Account --</option>{accounts.map(acc => (<option key={acc.id} value={acc.id}>ID: {acc.id} ({acc.currencyCode} - Bal: {acc.balance.toFixed(2)})</option>))}</select></div>
                        <div style={{ marginBottom: '10px' }}><label htmlFor="toAccount" style={{display: 'block', marginBottom: '5px'}}>To Account ID: </label><input id="toAccount" type="number" value={toAccountId} onChange={e => setToAccountId(e.target.value)} required placeholder="Recipient Account ID" /></div>
                        <div style={{ marginBottom: '10px' }}><label htmlFor="amount" style={{display: 'block', marginBottom: '5px'}}>Amount: </label><input id="amount" type="number" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} step="0.01" min="0.01" required /></div>
                        <div style={{ marginBottom: '10px' }}><label htmlFor="description" style={{display: 'block', marginBottom: '5px'}}>Description: </label><input id="description" type="text" value={transferDescription} onChange={e => setTransferDescription(e.target.value)} /></div>
                        <button type="submit" disabled={isMakingTransfer}>{isMakingTransfer ? "Sending..." : "Send Transfer"}</button>
                    </form>
                </div>
            </div>
            <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h3>Exchange Currencies Between Your Accounts</h3>
                <form onSubmit={handleExchangeSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="exchangeFromAccount" style={{display: 'block', marginBottom: '5px'}}>Sell from account (currency to sell):</label>
                        <select id="exchangeFromAccount" value={exchangeFromAccountId} onChange={e => setExchangeFromAccountId(e.target.value)} required>
                            <option value="">-- Select Source Account --</option>
                            {accounts.map(acc => (<option key={"from-"+acc.id} value={acc.id}>ID: {acc.id} ({acc.currencyCode} - Balance: {acc.balance.toFixed(2)})</option>))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="exchangeToAccount" style={{display: 'block', marginBottom: '5px'}}>Buy to account (currency to buy):</label>
                        <select id="exchangeToAccount" value={exchangeToAccountId} onChange={e => setExchangeToAccountId(e.target.value)} required>
                            <option value="">-- Select Destination Account --</option>
                            {accounts.filter(acc => acc.id !== parseInt(exchangeFromAccountId) && acc.currencyCode !== accounts.find(sAcc => sAcc.id === parseInt(exchangeFromAccountId))?.currencyCode).map(acc => (
                                <option key={"to-"+acc.id} value={acc.id}>ID: {acc.id} ({acc.currencyCode} - Balance: {acc.balance.toFixed(2)})</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="amountToExchange" style={{display: 'block', marginBottom: '5px'}}>Amount to Sell:</label>
                        <input id="amountToExchange" type="number" value={amountToExchange} onChange={e => setAmountToExchange(e.target.value)} step="0.01" min="0.01" required />
                        <span style={{marginLeft: '5px'}}>{exchangeFromAccountId && accounts.find(a => a.id === parseInt(exchangeFromAccountId))?.currencyCode}</span>
                    </div>
                    <button type="submit" disabled={isExchanging || !exchangeFromAccountId || !exchangeToAccountId || !amountToExchange}>{isExchanging ? "Exchanging..." : "Perform Exchange"}</button>
                </form>
                {/* Używamy camelCase, tak jak w logu z konsoli przeglądarki */}
                {exchangeApiResult && exchangeApiResult.success && exchangeApiResult.exchangeDetails && (
                    <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px'}}>
                        <h4>Exchange Successful!</h4>
                        <p>Debited: {exchangeApiResult.exchangeDetails.amountDebited.toFixed(2)} {exchangeApiResult.exchangeDetails.fromCurrency}</p>
                        <p>Credited: {exchangeApiResult.exchangeDetails.amountCredited.toFixed(4)} {exchangeApiResult.exchangeDetails.toCurrency}</p>
                        <p>Exchange Rate ({exchangeApiResult.exchangeDetails.fromCurrency}/{exchangeApiResult.exchangeDetails.toCurrency}): {exchangeApiResult.exchangeDetails.exchangeRate.toFixed(4)}</p>
                        <p>New Balance (From): {exchangeApiResult.exchangeDetails.newFromAccountBalance.toFixed(2)} {exchangeApiResult.exchangeDetails.fromCurrency}</p>
                        <p>New Balance (To): {exchangeApiResult.exchangeDetails.newToAccountBalance.toFixed(2)} {exchangeApiResult.exchangeDetails.toCurrency}</p>
                        <p>Transaction ID: {exchangeApiResult.exchangeDetails.transactionId}</p>
                    </div>
                )}
                 {exchangeApiResult && !exchangeApiResult.success && (
                    <p style={{ color: 'red', marginTop: '15px' }}>Error from API: {exchangeApiResult.errorMessage || 'Unknown error during exchange.'}</p>
                )}
            </div>
        </div>
    );
};
export default DashboardPage;