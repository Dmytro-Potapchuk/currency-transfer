import React, { useState, FormEvent } from "react";
import { useTranslation } from 'react-i18next';
import { convertCurrency } from "../../services/api";

 const CurrencyConverter = () => {
    const { t } = useTranslation();

    const [amountStr, setAmountStr] = useState("0");
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async (event?: FormEvent<HTMLFormElement>) => {
        if (event) event.preventDefault();
        setError(null);
        setResult(null);

        const numericAmount = parseFloat(amountStr);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError(t('enterCorrectAmountError'));
            return;
        }

        try {
            const responseData = await convertCurrency({
                FromCurrency: fromCurrency.toUpperCase(),
                ToCurrency: toCurrency.toUpperCase(),
                Amount: numericAmount
            });

            if (responseData && typeof responseData.convertedAmount === 'number') {
                setResult(responseData.convertedAmount);
            } else {
                console.error("Неожиданная структура ответа от convertCurrency:", responseData);
                setError(t('conversionResponseError'));
            }

        } catch (err) {
            console.error("Ошибка при конвертации:", err);

            setError(t('conversionError')); //
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "450px", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <h2>{t('currencyConverterTitle')}</h2> {/* <--- 3. ПЕРЕВОД ЗАГОЛОВКА */}

            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Сообщения об ошибках уже переведены через setError(t(...)) */}

            <form onSubmit={handleConvert}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="amount-converter" style={{ display: 'block', marginBottom: '5px' }}>{t('amountLabel')}:</label> {/* <--- ПЕРЕВОД */}
                    <input
                        id="amount-converter" // Изменил ID, чтобы не конфликтовал с другими формами, если будут на одной странице
                        type="number"
                        value={amountStr}
                        onChange={(e) => setAmountStr(e.target.value)}
                        placeholder={t('amountLabel')} // <--- ПЕРЕВОД ПЛЕЙСХОЛДЕРА
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        step="0.01"
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="fromCurrency-converter" style={{ display: 'block', marginBottom: '5px' }}>{t('fromLabel')}:</label> {/* <--- ПЕРЕВОД */}
                        <select
                            id="fromCurrency-converter"  // Изменил ID
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            {/* Коды валют обычно не переводятся, но если нужны переведенные названия, это отдельная задача */}
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="UAH">UAH</option>
                            {/* TODO: Загружать список валют из API getAllowedCurrencies */}
                        </select>
                    </div>
                    <span style={{ fontSize: '24px', alignSelf: 'center', paddingTop: '20px' }}>→</span>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="toCurrency-converter" style={{ display: 'block', marginBottom: '5px' }}>{t('toLabel')}:</label> {/* <--- ПЕРЕВОД */}
                        <select
                            id="toCurrency-converter" // Изменил ID
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="UAH">UAH</option>
                        </select>
                    </div>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {t('convertButton')} {/* <--- ПЕРЕВОД */}
                </button>
            </form>

            {result !== null && (
                <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                    {t('resultLabel')}: {result.toFixed(2)} {toCurrency.toUpperCase()} {/* <--- ПЕРЕВОД */}
                </p>
            )}
        </div>
    );
};

export {CurrencyConverter}