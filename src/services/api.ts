import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5033/api", // оставляем https
    // httpsAgent убираем полностью
});

// Конвертация валют
export const convertCurrency = (data: { fromCurrency: string; toCurrency: string; amount: number; }) =>
    API.post("/currency/convert", data);

// Отправка денег
export const sendMoney = (data: { receiver: string; amount: number; currency: string; }) =>
    API.post("/transfer/send", data);

// Получение денег
export const receiveMoney = (data: { receiver: string; amount: number; currency: string; }) =>
    API.post("/transfer/receive", data);

// Получение всех транзакций
export const getTransactions = () =>
    API.get("/transfer/transactions");
