import { useState } from "react";
import { convertCurrency } from "../services/api";

export const CurrencyConverter = () => {
    const [amount, setAmount] = useState(0);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [result, setResult] = useState<number | null>(null);

    const handleConvert = async () => {
        const response = await convertCurrency({ fromCurrency, toCurrency, amount });
        setResult(response.data.convertedAmount);
    };

    return (
        <div style={{ width: "48%", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <h2>Currency Converter</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
                placeholder="Amount"
            />
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="UAH">UAH</option>
                </select>
                <span style={{ fontSize: '24px', alignSelf: 'center' }}>→</span>
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="UAH">UAH</option>
                </select>
            </div>
            <button onClick={handleConvert}>Convert</button>

            {result !== null && <p>Converted Amount: {result} {toCurrency}</p>}
        </div>
    );
};
