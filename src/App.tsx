// src/App.tsx

import React, { useState, useEffect, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

import './App.css';

// --- Funkcje pomocnicze i Komponenty wewnętrzne ---

// Funkcja sprawdzająca token w localStorage
const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    // Możesz dodać console.log tutaj, jeśli chcesz widzieć każde sprawdzenie
    // console.log("isAuthenticated check ran. Token found:", !!token);
    return !!token;
};

// Interfejs Propsów dla ProtectedRoute - już nie potrzebuje isAuthenticated
interface ProtectedRouteProps {
    children: ReactNode;
}

// Komponent Chronionej Trasy - teraz sprawdza localStorage bezpośrednio
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuth = isAuthenticated(); // Sprawdź localStorage w momencie renderowania
    console.log("ProtectedRoute rendering. Checked localStorage, isAuth:", isAuth); // Logowanie

    if (!isAuth) {
        console.log("ProtectedRoute: User NOT authenticated based on localStorage check, navigating to /login");
        // Jeśli nie ma tokenu w localStorage, przekieruj na /login
        return <Navigate to="/login" replace />;
    }

    console.log("ProtectedRoute: User IS authenticated based on localStorage check, rendering children");
    // Jeśli token jest, renderuj komponent potomny
    return children;
};

// --- Główny Komponent Aplikacji ---

const App: React.FC = () => {
    // Stan jest nadal używany do aktualizacji UI (np. paska nawigacji)
    // i do decydowania o przekierowaniu z trasy głównej "/"
    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(isAuthenticated());

    console.log("App component rendered. Current isUserAuthenticated state:", isUserAuthenticated);

    // Efekt do potencjalnej synchronizacji między kartami (opcjonalnie)
    useEffect(() => {
        const checkAuth = () => setIsUserAuthenticated(isAuthenticated());
        window.addEventListener('storage', checkAuth); // Nasłuchuj zmian w localStorage z innych kart
        return () => window.removeEventListener('storage', checkAuth); // Posprzątaj listener
    }, []);

    // Funkcja wywoływana po udanym logowaniu w LoginPage
    const handleLoginSuccess = () => {
        console.log("handleLoginSuccess called in App! Setting state to true.");
        // Nadal aktualizujemy stan, aby UI (np. nawigacja) zareagowało natychmiast
        setIsUserAuthenticated(true);
    };

    // Funkcja do obsługi wylogowania
    const handleLogout = () => {
        console.log("handleLogout called in App! Removing token and setting state to false.");
        localStorage.removeItem('authToken');
        setIsUserAuthenticated(false);
    };

    return (
        <Router>
            <div>
                {/* Pasek Nawigacji (używa stanu isUserAuthenticated) */}
                <nav style={{
                    padding: '10px 20px',
                    background: '#333',
                    color: 'white',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontSize: '1.2em' }}>
                            CurrencyApp
                        </Link>
                        {isUserAuthenticated && (
                             <Link to="/app" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>
                                Dashboard
                            </Link>
                        )}
                    </div>
                    <div>
                        {!isUserAuthenticated ? (
                            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                                Login
                            </Link>
                        ) : (
                            <button
                                onClick={handleLogout}
                                style={{ background: '#f44336', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </nav>

                {/* Definicje Tras */}
                <Routes>
                    {/* Trasa logowania nadal przekazuje handleLoginSuccess, aby zaktualizować stan App */}
                    <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

                    {/* Trasa chroniona - ProtectedRoute sam sprawdzi localStorage */}
                    <Route
                        path="/app"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Domyślna trasa "/" używa stanu App do podjęcia decyzji */}
                    <Route
                        path="/"
                        element={
                            isUserAuthenticated ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />
                        }
                    />

                    {/* Trasa 404 */}
                    <Route path="*" element={
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <h2>404 - Page Not Found</h2>
                            <p><Link to="/">Go back to Home</Link></p>
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;