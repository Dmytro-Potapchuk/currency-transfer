// Plik: src/services/api.ts

import axios from "axios";

// --- Konfiguracja klienta Axios ---
const getToken = () => localStorage.getItem("token");

const API = axios.create({
    baseURL: "http://localhost:5033/api",
    headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Centralna obsługa błędów ---
const handleError = (error: any) => {
    // Ignoruj błąd, jeśli użytkownik sam anulował operację
    if (error.message?.includes("cancelled")) {
        console.log("Operation cancelled by user.");
        return;
    }

    let message = "Wystąpił nieoczekiwany błąd.";
    if (error.response) {
        console.error("API Error:", error.response.data, error.response.status);
        const errorData = error.response.data;

        if (typeof errorData === 'string') message = errorData;
        else if (errorData?.message) message = errorData.message;
        else if (errorData?.title) message = errorData.title;
    } else if (error.request) {
        console.error("No response from API:", error.request);
        message = "Serwer nie odpowiada. Spróbuj ponownie później.";
    } else {
        console.error("Error:", error.message);
    }

    alert(message);
};

const makeApiRequest = async (request: () => Promise<any>) => {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// --- Definicje typów ---
export interface UserProfile { id: string; firstName: string; lastName: string; email: string; userName: string; }
export interface UpdateUserProfileData { firstName?: string; lastName?: string; email?: string; }
export interface UserAccount { id: number; currencyCode: string; balance: number; userId?: number; }
export interface TransactionFromAPI { id: number; timestamp: string; type: string; amount: number; currencyCode: string; description?: string | null; fromAccountId: number; toAccountId: number; }
export interface CreatePayUPaymentPayload { accountId: number; amount: number; currencyCode: string; description?: string; }
export interface CreatePayUPaymentResponse { orderId?: string; redirectUri?: string; success: boolean; errorMessage?: string; }
export interface PayUPaymentStatus { orderId?: string; status?: string; amount?: number; currencyCode?: string; }

// --- Funkcje API ---

// --- Auth ---
export const registerUser = (userData: any) => makeApiRequest(() => API.post("/Auth/register", userData));
export const loginUser = async (credentials: { email?: string; username?: string; password?: string; }) => {
    try {
        const response = await API.post("/Auth/login", credentials);
        const token = response.data?.token || response.data?.accessToken;
        if (token) localStorage.setItem("token", token);
        else throw new Error("Token not found in login response.");
        return response.data;
    } catch (error) {
        localStorage.removeItem("token");
        handleError(error);
        throw error;
    }
};
export const logoutUser = () => { localStorage.removeItem("token"); };

// --- Profile & User Data ---
export const getMe = (): Promise<{id: string; username: string; email: string | null; role: string | null } | null> => makeApiRequest(() => API.get("/Auth/me"));
export const getMyProfile = (): Promise<UserProfile> => makeApiRequest(() => API.get("/Profile/me"));
export const updateMyProfile = (profileData: UpdateUserProfileData): Promise<any> => makeApiRequest(() => API.put("/Profile/me", profileData));
export const deleteMyAccount = (): Promise<any> => {
    if (!window.confirm("Czy na pewno chcesz trwale usunąć swoje konto?")) {
        throw new Error("User cancelled account deletion.");
    }
    return makeApiRequest(() => API.delete("/Profile/me"));
};

// --- Currency ---
export const convertCurrency = (data: { FromCurrency: string; ToCurrency:string; Amount: number; }) => makeApiRequest(() => API.post("/Currency/convert", data));

// --- Accounts ---
export const getMyAccounts = async (): Promise<UserAccount[]> => {
    const data = await makeApiRequest(() => API.get("/Accounts"));
    return Array.isArray(data) ? data : [];
};
export const createAccount = (accountData: { currencyCode: string; }): Promise<UserAccount> => makeApiRequest(() => API.post("/Accounts", accountData));

// --- Transfers & Exchange ---
export const createTransfer = (data: { fromAccountId: number; toAccountId: number; amount: number; description?: string; }) => makeApiRequest(() => API.post("/Transfers", data));
export const getTransactions = async (params?: any): Promise<TransactionFromAPI[]> => {
    const data = await makeApiRequest(() => API.get("/Transfers", { params }));
    return Array.isArray(data) ? data : [];
};
export const performExchange = (exchangeData: { fromAccountId: number; toAccountId: number; amount: number; }) => makeApiRequest(() => API.post("/Exchange/perform", exchangeData));

// --- PayU ---
export const createPayUPayment = (payload: CreatePayUPaymentPayload): Promise<CreatePayUPaymentResponse> => makeApiRequest(() => API.post("/PayU/create-payment", payload));
export const getPayUPaymentStatus = (orderId: string): Promise<PayUPaymentStatus> => makeApiRequest(() => API.get(`/PayU/payment-status/${orderId}`));


// --- NOWE FUNKCJE DLA ADMINA ---

export const adminDeleteAccount = (accountId: number): Promise<any> => {
    if (!window.confirm(`Czy na pewno chcesz usunąć konto o ID: ${accountId}?`)) {
        throw new Error("Admin cancelled account deletion.");
    }
    return makeApiRequest(() => API.delete(`/Admin/accounts/${accountId}`));
};

export const adminDeleteTransaction = (transactionId: number): Promise<any> => {
    if (!window.confirm(`Czy na pewno chcesz usunąć transakcję o ID: ${transactionId}?`)) {
        throw new Error("Admin cancelled transaction deletion.");
    }
    return makeApiRequest(() => API.delete(`/Admin/transactions/${transactionId}`));
};

// Dodatkowe funkcje, których możesz potrzebować do panelu admina
// Uwaga: Będziesz musiał stworzyć odpowiednie endpointy w backendzie!
export const adminGetAllAccounts = (): Promise<UserAccount[]> => {
    return makeApiRequest(() => API.get("/Accounts/all"));
};

export const adminGetAllTransactions = (): Promise<TransactionFromAPI[]> => {
    return makeApiRequest(() => API.get("/Transfers/all"));
};
