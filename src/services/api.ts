import axios from "axios";

const API_BASE_URL = "http://localhost:5033/api"; // Upewnij się, że port jest poprawny

// --- Interfejsy dla typowania ---
interface AuthResponse { token: string; username: string; role: string; }
interface UserProfile { id: string; username: string; email: string | null; role: string; }
export interface AccountResponse { id: number; currencyCode: string; balance: number; }
interface CreateAccountData { currencyCode: string; initialBalance?: number; }
interface TransferRequestData { fromAccountId: number; toAccountId: number; amount: number; description?: string; }
interface TransferResponse { transactionId: number; fromAccountId: number; toAccountId: number; amountTransferred: number; currencyCode: string; timestamp: string; description?: string; newSourceAccountBalance: number; }

// Interfejsy dla Wymiany Walut (teraz z camelCase, zgodnie z tym co logowałeś)
interface ExchangeRequestData {
    fromAccountId: number;
    toAccountId: number;
    amountToExchange: number;
}

export interface ExchangeResponse { // Ten interfejs opisuje obiekt 'exchangeDetails'
    transactionId: number;
    fromAccountId: number;
    fromCurrency: string;
    amountDebited: number;
    toAccountId: number;
    toCurrency: string;
    amountCredited: number;
    exchangeRate: number;
    timestamp: string;
    newFromAccountBalance: number; // camelCase
    newToAccountBalance: number; // camelCase
}

export interface ExchangeResultWrapper { // Ten interfejs opisuje całą odpowiedź z endpointu wymiany
    success: boolean; // małe s
    errorMessage?: string; // małe e, duże M (dostosowane do Twojego logu)
    exchangeDetails?: ExchangeResponse; // małe e, duże D (dostosowane do Twojego logu)
}

// --- Funkcja pomocnicza do pobierania nagłówków autoryzacyjnych ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

// --- Funkcje API ---
export const loginUser = async (credentials: any): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/Auth/login`, credentials);
    if (response.data.token) localStorage.setItem('authToken', response.data.token);
    return response.data;
};
export const registerUser = async (userData: any): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/Auth/register`, userData);
    if (response.data.token) localStorage.setItem('authToken', response.data.token);
    return response.data;
};
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
    const response = await axios.get<UserProfile>(`${API_BASE_URL}/Auth/me`, { headers: getAuthHeaders() });
    return response.data;
};
export const logoutUser = (): void => {
    localStorage.removeItem('authToken');
};
export const fetchUserAccounts = async (): Promise<AccountResponse[]> => {
    const response = await axios.get<AccountResponse[]>(`${API_BASE_URL}/Accounts`, { headers: getAuthHeaders() });
    return response.data;
};
export const createNewAccount = async (accountData: CreateAccountData): Promise<AccountResponse> => {
    const response = await axios.post<AccountResponse>(`${API_BASE_URL}/Accounts`, accountData, { headers: getAuthHeaders() });
    return response.data;
};
export const makeTransfer = async (transferData: TransferRequestData): Promise<TransferResponse> => {
    const response = await axios.post<TransferResponse>(`${API_BASE_URL}/Transfers`, transferData, { headers: getAuthHeaders() });
    return response.data;
};
export const fetchAllowedCurrencies = async (): Promise<string[]> => {
    const response = await axios.get<string[]>(`${API_BASE_URL}/Utils/allowed-currencies`);
    return response.data;
};

// Funkcja dla Wymiany Walut - zwraca teraz ExchangeResultWrapper
export const performCurrencyExchange = async (exchangeData: ExchangeRequestData): Promise<ExchangeResultWrapper> => {
    const response = await axios.post<ExchangeResultWrapper>(`${API_BASE_URL}/Exchange/perform`, exchangeData, { headers: getAuthHeaders() });
    return response.data;
};


// Stare funkcje, jeśli jeszcze są gdzieś używane
export const convertCurrency = (data: { fromCurrency: string; toCurrency: string; amount: number; }) =>
    axios.post(`${API_BASE_URL}/currency/convert`, data);
export const sendMoney_OLD = (data: { receiver: string; amount: number; currency: string; }) =>
    axios.post(`${API_BASE_URL}/transfer/send`, data, { headers: getAuthHeaders() });
export const receiveMoney_OLD = (data: { receiver: string; amount: number; currency: string; }) =>
    axios.post(`${API_BASE_URL}/transfer/receive`, data, { headers: getAuthHeaders() });
export const getTransactions_OLD = () =>
    axios.get(`${API_BASE_URL}/transfer/transactions`, { headers: getAuthHeaders() });