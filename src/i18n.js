// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            // Общие
            "accountDisplay": "Account (ID: {{id}}) - Balance: {{balance}} {{currencyCode}}",
            "appTitle": "Currency Transfer App",
            "logout": "Logout",
            // LoginPage
            "loginTitle": "Login",
            "usernameLabel": "Username",
            "passwordLabel": "Password",
            "loginButton": "Login",
            "noAccount": "No account? Register",
            // RegisterPage
            "registerTitle": "Register",
            "firstNameLabel": "First Name",
            "lastNameLabel": "Last Name",
            "emailLabel": "Email",
            "registerButton": "Register",
            "haveAccount": "Already have an account? Login",
            // Dashboard & Forms
            "currencyConverterTitle": "Currency Converter",
            "amountLabel": "Amount",
            "fromLabel": "From",
            "toLabel": "To",
            "convertButton": "Convert",
            "resultLabel": "Result",
            "createTransferTitle": "Create Transfer",
            "fromAccountLabel": "From account",
            "selectAccountPlaceholder": "-- Select your account --",
            "receiverAccountIdLabel": "Recipient Account ID",
            "receiverAccountPlaceholder": "Recipient's numeric Account ID",
            "transferAmountLabel": "Amount", // Можно использовать общий "amountLabel"
            "descriptionLabel": "Description (Purpose)",
            "descriptionPlaceholder": "e.g., payment for services",
            "performTransferButton": "Perform Transfer",
            "transactionsHistoryTitle": "Transactions History",
            "noTransactions": "No transactions yet.",
            "loadingTransactions": "Loading transactions history...",
            "errorTransactions": "Error fetching transactions. Please try again.",
            // Сообщения об ошибках и успехе
            "insufficientFunds": "Insufficient funds in the source account.",
            "destinationAccountNotFound": "Destination account not found.",
            "transferSuccess": "Transfer processed successfully! Transaction ID: {{transactionId}}",
            "createAccountSuccess": "Account in {{currencyCode}} created successfully! Updating list...",
            "enterCorrectAmountError": "Please enter a correct amount for conversion.",
            "conversionError": "Currency conversion failed. Please try again.",
            "conversionResponseError": "Could not process the server's conversion response. The 'convertedAmount' field is missing or has an incorrect type.",
            "transactionTypeLabel": "Type",
            "transactionAmountLabel": "Amount", // Можно использовать общий "amountLabel"
            "transactionDescriptionLabel": "Description",
            "transactionFromAccountLabel": "From Account ID",
            "transactionToAccountLabel": "To Account ID",
        }
    },
    ru: {
        translation: {
            // Общие
            "accountDisplay": "Счет (ID: {{id}}) - Баланс: {{balance}} {{currencyCode}}", // Этот вариант ты хочешь видеть
            "appTitle": "Приложение для Перевода Валют",
            "logout": "Выйти",
            // LoginPage
            "loginTitle": "Вход в систему",
            "usernameLabel": "Имя пользователя",
            "passwordLabel": "Пароль",
            "loginButton": "Войти",
            "noAccount": "Нет аккаунта? Зарегистрироваться",
            // RegisterPage
            "registerTitle": "Регистрация",
            "firstNameLabel": "Имя",
            "lastNameLabel": "Фамилия",
            "emailLabel": "Email",
            "registerButton": "Зарегистрироваться",
            "haveAccount": "Уже есть аккаунт? Войти",
            // Dashboard & Forms
            "currencyConverterTitle": "Конвертер валют",
            "amountLabel": "Сумма",
            "fromLabel": "Из",
            "toLabel": "В",
            "convertButton": "Конвертировать",
            "resultLabel": "Результат",
            "createTransferTitle": "Создать перевод",
            "fromAccountLabel": "Со счета",
            "selectAccountPlaceholder": "-- Выберите ваш счет --",
            "receiverAccountIdLabel": "ID счета получателя",
            "receiverAccountPlaceholder": "Числовой ID счета получателя",
            "transferAmountLabel": "Сумма",
            "descriptionLabel": "Назначение платежа",
            "descriptionPlaceholder": "например, оплата услуг",
            "performTransferButton": "Выполнить перевод",
            "transactionsHistoryTitle": "История транзакций",
            "noTransactions": "Транзакций пока нет.",
            "loadingTransactions": "Загрузка истории транзакций...",
            "errorTransactions": "Ошибка при получении транзакций. Попробуйте снова.",
            // Сообщения
            "insufficientFunds": "Недостаточно средств на счете отправителя.",
            "destinationAccountNotFound": "Счет назначения не найден.",
            "transferSuccess": "Перевод успешно обработан! ID транзакции: {{transactionId}}",
            "createAccountSuccess": "Счет в {{currencyCode}} успешно создан! Обновляем список...",
            "enterCorrectAmountError": "Пожалуйста, введите корректную сумму для конвертации.",
            "conversionError": "Произошла ошибка при конвертации валюты. Попробуйте снова.",
            "conversionResponseError": "Не удалось обработать ответ от сервера конвертации. Поле 'convertedAmount' отсутствует или имеет неверный тип.",
            "transactionTypeLabel": "Тип",
            "transactionAmountLabel": "Сумма",
            "transactionDescriptionLabel": "Описание",
            "transactionFromAccountLabel": "Со счета ID",
            "transactionToAccountLabel": "На счет ID",
        }
    },
    pl: {
        translation: {
            // Общие
            "accountDisplay": "Konto (ID: {{id}}) - Saldo: {{balance}} {{currencyCode}}",
            "appTitle": "Aplikacja do Przelewów Walutowych",
            "logout": "Wyloguj się",
            // LoginPage
            "loginTitle": "Logowanie",
            "usernameLabel": "Nazwa użytkownika",
            "passwordLabel": "Hasło",
            "loginButton": "Zaloguj się",
            "noAccount": "Nie masz konta? Zarejestruj się",
            // RegisterPage
            "registerTitle": "Rejestracja",
            "firstNameLabel": "Imię",
            "lastNameLabel": "Nazwisko",
            "emailLabel": "Email",
            "registerButton": "Zarejestruj się",
            "haveAccount": "Masz już konto? Zaloguj się",
            // Dashboard & Forms
            "currencyConverterTitle": "Przelicznik Walut",
            "amountLabel": "Kwota",
            "fromLabel": "Z",
            "toLabel": "Na",
            "convertButton": "Przelicz",
            "resultLabel": "Wynik",
            "createTransferTitle": "Utwórz przelew",
            "fromAccountLabel": "Z konta",
            "selectAccountPlaceholder": "-- Wybierz swoje konto --",
            "receiverAccountIdLabel": "ID konta odbiorcy",
            "receiverAccountPlaceholder": "Numeryczne ID konta odbiorcy",
            "transferAmountLabel": "Kwota",
            "descriptionLabel": "Opis (Cel)",
            "descriptionPlaceholder": "np. płatność za usługi",
            "performTransferButton": "Wykonaj przelew",
            "transactionsHistoryTitle": "Historia transakcji",
            "noTransactions": "Brak transakcji.",
            "loadingTransactions": "Ładowanie historii transakcji...",
            "errorTransactions": "Błąd podczas pobierania transakcji. Spróbuj ponownie.",
            // Сообщения
            "insufficientFunds": "Niewystarczające środki na koncie źródłowym.",
            "destinationAccountNotFound": "Nie znaleziono konta docelowego.",
            "transferSuccess": "Przelew przetworzony pomyślnie! ID transakcji: {{transactionId}}",
            "createAccountSuccess": "Konto w {{currencyCode}} zostało pomyślnie utworzone! Aktualizowanie listy...",
            "enterCorrectAmountError": "Proszę wprowadzić poprawną kwotę do przeliczenia.",
            "conversionError": "Wystąpił błąd podczas przeliczania waluty. Spróbuj ponownie.",
            "conversionResponseError": "Nie można przetworzyć odpowiedzi serwera dotyczącej konwersji. Pole 'convertedAmount' brakuje lub ma nieprawidłowy typ.",
            "transactionTypeLabel": "Typ",
            "transactionAmountLabel": "Kwota",
            "transactionDescriptionLabel": "Opis",
            "transactionFromAccountLabel": "Z konta ID",
            "transactionToAccountLabel": "Na konto ID",
        }
    },
    uk: {
        translation: {
            // Общие
            "accountDisplay": "Рахунок (ID: {{id}}) - Баланс: {{balance}} {{currencyCode}}",
            "appTitle": "Додаток для Переказу Валют",
            "logout": "Вийти",
            // LoginPage
            "loginTitle": "Вхід до системи",
            "usernameLabel": "Ім'я користувача",
            "passwordLabel": "Пароль",
            "loginButton": "Увійти",
            "noAccount": "Немає облікового запису? Зареєструватися",
            // RegisterPage
            "registerTitle": "Реєстрація",
            "firstNameLabel": "Ім'я",
            "lastNameLabel": "Прізвище",
            "emailLabel": "Email",
            "registerButton": "Зареєструватися",
            "haveAccount": "Вже є обліковий запис? Увійти",
            // Dashboard & Forms
            "currencyConverterTitle": "Конвертер валют",
            "amountLabel": "Сума",
            "fromLabel": "З",
            "toLabel": "В",
            "convertButton": "Конвертувати",
            "resultLabel": "Результат",
            "createTransferTitle": "Створити переказ",
            "fromAccountLabel": "З рахунку",
            "selectAccountPlaceholder": "-- Оберіть ваш рахунок --",
            "receiverAccountIdLabel": "ID рахунку отримувача",
            "receiverAccountPlaceholder": "Числовий ID рахунку отримувача",
            "transferAmountLabel": "Сума",
            "descriptionLabel": "Призначення платежу",
            "descriptionPlaceholder": "наприклад, оплата послуг",
            "performTransferButton": "Виконати переказ",
            "transactionsHistoryTitle": "Історія транзакцій",
            "noTransactions": "Транзакцій ще немає.",
            "loadingTransactions": "Завантаження історії транзакцій...",
            "errorTransactions": "Помилка під час отримання транзакцій. Спробуйте знову.",
            // Сообщения
            "insufficientFunds": "Недостатньо коштів на рахунку відправника.",
            "destinationAccountNotFound": "Рахунок призначення не знайдено.",
            "transferSuccess": "Переказ успішно оброблено! ID транзакції: {{transactionId}}",
            "createAccountSuccess": "Рахунок у {{currencyCode}} успішно створено! Оновлення списку...",
            "enterCorrectAmountError": "Будь ласка, введіть коректну суму для конвертації.",
            "conversionError": "Сталася помилка під час конвертації валюти. Спробуйте знову.",
            "conversionResponseError": "Не вдалося обробити відповідь сервера конвертації. Поле 'convertedAmount' відсутнє або має неправильний тип.",
            "transactionTypeLabel": "Тип",
            "transactionAmountLabel": "Сума",
            "transactionDescriptionLabel": "Опис",
            "transactionFromAccountLabel": "З рахунку ID",
            "transactionToAccountLabel": "На рахунок ID",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'ru',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'],
        }
    });

export default i18n;