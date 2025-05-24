import axios from "axios";


const getToken = () => {
    return localStorage.getItem("token");
};


const API = axios.create({
    baseURL: "http://localhost:5033/api",
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Определение handleError
const handleError = (error: any) => {
    if (error.response) {
        console.error("API Error:", error.response.data, error.response.status);
        const errorData = error.response.data;
        let message = "Произошла ошибка при взаимодействии с сервером.";

        if (typeof errorData === 'string') {
            message = errorData;
        } else if (errorData && typeof errorData.detail === 'string') {
            message = errorData.detail;
        } else if (errorData && Array.isArray(errorData.detail) && errorData.detail[0] && typeof errorData.detail[0].msg === 'string') {
            message = errorData.detail.map((err: any) => `${err.loc.join('.')} - ${err.msg}`).join('; ');
        } else if (errorData && typeof errorData.title === 'string') {
            if (errorData.errors && Object.keys(errorData.errors).length > 0) {
                const errorMessages = Object.values(errorData.errors).flat() as string[];
                message = `${errorData.title} ${errorMessages.join(' ')}`;
            } else if (errorData.message) {
                message = errorData.message;
            } else if (errorData.title) { // Если есть title, но нет errors или message
                message = errorData.title;
            }
        } else if (errorData && typeof errorData.message === 'string') {
            message = errorData.message;
        }


        if (error.response.status === 401) {
            alert(`Вы не авторизованы. ${message}`);
            // localStorage.removeItem("token");
            // window.location.href = '/login';
        } else if (error.response.status === 404) {
            alert(`Ресурс не найден. ${message}`);
        } else if (error.response.status === 400) {
            alert(`Неверный запрос: ${message}`);
        } else if (error.response.status === 500) {
            alert(`Внутренняя ошибка сервера. ${message}`);
        } else {
            alert(message);
        }
    } else if (error.request) {
        console.error("No response from API:", error.request);
        alert("Сервер не отвечает. Пожалуйста, попробуйте снова позже.");
    } else {
        console.error("Error:", error.message);
        alert("Произошла ошибка. Пожалуйста, попробуйте снова.");
    }
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

// --- Типы данных, получаемые от API ---

export interface UserAccount {
    id: number;
    currencyCode: string;
    balance: number;
    userId?: number;
    // accountNumber: string; /
}


export interface TransactionFromAPI {
    id: number;
    timestamp: string;
    type: string;
    amount: number;
    currencyCode: string;
    description?: string | null;
    fromAccountId: number;
    toAccountId: number;

}


// --- Auth ---
export const registerUser = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}) => {
    try {
        const response = await API.post("/Auth/register", userData);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const loginUser = async (credentials: { username: string; password: string; rememberMe?: boolean }) => {
    try {
        const response = await API.post("/Auth/login", credentials);
        if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
        } else if (response.data && response.data.accessToken) {
            localStorage.setItem("token", response.data.accessToken);
        } else {
            console.error("Token not found in login response:", response.data);
            throw new Error("Токен не получен от сервера после входа.");
        }
        return response.data;
    } catch (error) {
        localStorage.removeItem("token");
        handleError(error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    console.log("User logged out, token removed.");
};

export const getMe = async (): Promise<{id: string, username: string, email: string | null, role: string | null } | null> => {
    // Уточнили тип возвращаемого значения на основе твоего лога
    return await makeApiRequest(() => API.get("/Auth/me"));
};

// --- Currency ---
export const convertCurrency = async (data: { FromCurrency: string; ToCurrency: string; Amount: number; }) => {
    // Предполагаем, что API возвращает объект типа { convertedAmount: number, currency: string }
    // или как определено в твоем CurrencyResponse.cs
    return await makeApiRequest(() => API.post("/Currency/convert", data)) as Promise<{ convertedAmount: number; currency: string }>;
};

// --- Transfers ---

export const createTransfer = async (data: {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    description?: string;
}) => {
    const payloadForBackend = {
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        amount: data.amount,
        description: data.description
    };

    return await makeApiRequest(() => API.post("/Transfers", payloadForBackend));
};


export const getTransactions = async (params?: any): Promise<TransactionFromAPI[]> => {
    try {
        const response = await API.get("/Transfers", { params });
        if (Array.isArray(response.data)) {
            return response.data as TransactionFromAPI[];
        } else {
            console.error("getTransactions: API did not return an array!", response.data);
            return [];
        }
    } catch (error) {
        handleError(error);

        return [];
    }
};

// --- Utils ---
export const getAllowedCurrencies = async (): Promise<string[]> => {
    return await makeApiRequest(() => API.get("/Utils/allowed-currencies"));
};

// --- Accounts ---
export const createAccount = async (accountData: { currencyCode: string; }) => {
    // Предполагаем, что API возвращает созданный UserAccount
    return await makeApiRequest(() => API.post("/Accounts", accountData)) as Promise<UserAccount>;
};

export const getMyAccounts = async (): Promise<UserAccount[]> => {
    // Уточнили, что ожидаем массив UserAccount или он будет пуст
    const data = await makeApiRequest(() => API.get("/Accounts"));
    if (Array.isArray(data)) {
        return data as UserAccount[];
    }
    console.warn("getMyAccounts did not return an array, returning empty array instead.", data);
    return []; // Возвращаем пустой массив, если API вернул что-то не то
};

export const getAccountDetails = async (accountId: string | number): Promise<UserAccount | null> => {
    return await makeApiRequest(() => API.get(`/Accounts/${accountId}`));
};

// --- Exchange ---
export const performExchange = async (exchangeData: { fromAccountId: number; toAccountId: number; amount: number; }) => {

    return await makeApiRequest(() => API.post("/Exchange/perform", exchangeData));
};