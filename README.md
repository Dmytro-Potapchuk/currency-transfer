# Aplikacja Frontendowa do Transferu Walut

## Opis Projektu

Jest to interfejs użytkownika (frontend) stworzony w technologii React, który komunikuje się z backendowym API `CurrencyTransferAPI` w celu umożliwienia użytkownikom wykonywania operacji finansowych, takich jak transfery walut, konwersja walut i zarządzanie kontami. Aplikacja wspiera wielojęzyczność.

## Technologie

* **React** (v18+)
* **TypeScript**
* **Axios** (do zapytań HTTP do backendu)
* **react-router-dom** (do nawigacji i routingu)
* **i18next** & **react-i18next** (do internacjonalizacji)
* CSS (lub preferowany sposób stylowania)

## Główne Funkcjonalności

* **Uwierzytelnianie Użytkownika:**
    * Formularz rejestracji
    * Formularz logowania
* **Panel Główny (Dashboard):** Dostępny po zalogowaniu, zawierający:
    * Konwerter walut (komunikuje się z API backendu)
    * Formularz do tworzenia przelewów między kontami (z wyborem konta źródłowego i docelowego ID)
    * Możliwość szybkiego tworzenia kont walutowych (USD, EUR, UAH)
    * Wyświetlanie historii transakcji użytkownika
* **Wielojęzyczność:**
    * Obsługa języków: Angielski (GB), Polski (PL), Ukraiński (UA), Rosyjski (RU)
    * Przełącznik języków z ikonami flag

## Struktura Projektu (Główne Katalogi)

* `src/`
    * `components/` - Główne komponenty React (np. `LoginPage.tsx`, `TransferForm.tsx`, `CurrencyConverter.tsx`, `TransactionList.tsx`, `LanguageSwitcher.tsx`, `PublicHeader.tsx`)
    * `services/`
        * `api.ts` - Konfiguracja Axios i funkcje do komunikacji z backend API.
    * `assets/` (lub `svg/`) - Zasoby statyczne, np. ikony flag SVG.
    * `App.tsx` - Główny komponent aplikacji, konfiguracja routingu.
    * `index.tsx` (lub `main.tsx`) - Punkt wejścia aplikacji, inicjalizacja React i i18next.
    * `i18n.js` - Konfiguracja i18next i pliki z tłumaczeniami.
    * `App.css`, `index.css` - Główne pliki stylów.

## Konfiguracja i Uruchomienie

### Wymagania Wstępne

* [Node.js](https://nodejs.org/) (zalecana wersja LTS)
* npm (zazwyczaj instalowany z Node.js) lub yarn

### Konfiguracja

1.  **API Backendu:**
    * Upewnij się, że backend `CurrencyTransferAPI` jest uruchomiony i dostępny.
    * Domyślnie frontend oczekuje, że API backendu będzie działać pod adresem `http://localhost:5033/api`. Adres ten jest skonfigurowany w `src/services/api.ts`. W razie potrzeby zmień `baseURL` w tym pliku.

### Uruchomienie Projektu

1.  Sklonuj repozytorium (jeśli dotyczy).
2.  Otwórz terminal w głównym katalogu projektu frontendu (`currency-transfer-frontend`).
3.  Zainstaluj zależności:
    ```bash
    npm install
    ```
    lub jeśli używasz yarn:
    ```bash
    yarn install
    ```
4.  Uruchom aplikację deweloperską:
    ```bash
    npm start
    ```
    lub jeśli używasz yarn:
    ```bash
    yarn start
    ```
    Aplikacja powinna być dostępna pod adresem `http://localhost:3000` (lub innym, jeśli port jest zajęty).

## Internacjonalizacja (i18n)

Aplikacja używa `i18next` do obsługi wielu języków. Pliki tłumaczeń znajdują się bezpośrednio w konfiguracji w `src/i18n.js`. Obsługiwane języki to angielski, polski, ukraiński i rosyjski.

## Odniesienie do Wymagań Projektowych

Projekt spełnia wymaganie dotyczące "Prostego frontendu", umożliwiając interakcję z API REST backendu.

## TODO / Możliwe Rozszerzenia

* Bardziej zaawansowana obsługa błędów i informacji zwrotnych dla użytkownika w interfejsie.
* Strona profilu użytkownika z możliwością aktualizacji danych (wymaga implementacji `PUT` na backendzie).
* Możliwość usuwania kont walutowych (wymaga implementacji `DELETE` na backendzie i przemyślenia logiki biznesowej).
* Dynamiczne ładowanie listy dostępnych walut do konwertera i formularza przelewów z API (`/api/Utils/allowed-currencies`).
* Ulepszenie wyświetlania historii transakcji (np. filtrowanie, paginacja, wskazanie, czy transakcja jest przychodząca czy wychodząca dla danego konta).
* Dodanie testów jednostkowych i integracyjnych dla komponentów.
