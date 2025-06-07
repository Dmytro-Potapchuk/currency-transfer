// Plik: src/App.tsx

import React, { useState, useEffect, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- Komponenty Stron ---
import { CurrencyConverter } from './components/CurrencyConverter';
import { TransferForm, TransactionList } from './components/Transaction';
import { LoginPage, RegisterPage } from './components/LoginRegister';
import DepositForm from "./components/DepositForm/DepositForm";
import PaymentStatusPage from "./components/DepositForm/PaymentStatusPage";

import AdminDashboard from './components/AdminDashboard/AdminDashboard';


import { logoutUser, getMe } from './services/api';
import { LanguageSwitcher } from './components/LanguageSwitcher';

import './App.css';
import {ProtectedRoute} from "./components/Route";
import ProfilePage from "./components/ProfilePage";

// ==================================================================
// Komponent Głównego Układu (Layout)
// ==================================================================
const MainLayout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userDisplayInfo, setUserDisplayInfo] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getMe();
                setUserDisplayInfo(userData?.email || userData?.username || null);
                // Sprawdzamy, czy tablica ról zawiera 'Admin'
                if (userData?.role && Array.isArray(userData.role) && userData.role.includes('Admin')) {
                    setIsAdmin(true);
                } else if (userData?.role === 'Admin') { // Zabezpieczenie, jeśli rola jest stringiem
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Failed to fetch user data for layout:", error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <>
            <header style={{
                background: '#ffffff', padding: '15px 30px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/" style={{display: 'flex', alignItems: 'center', gap: '20px', textDecoration: 'none'}}>
                        <span role="img" aria-label="logo" style={{ fontSize: '24px' }}>💸</span>
                        <h1 style={{ fontSize: '1.4em', margin: 0, color: '#333' }}>{t('appTitle')}</h1>
                    </Link>
                    <LanguageSwitcher />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '5px' }}>
                    {userDisplayInfo && <span style={{ color: '#555' }}>{userDisplayInfo}</span>}
                    {isAdmin && (
                        <Link to="/admin" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>
                            Panel Admina
                        </Link>
                    )}
                    <Link to="/profile" style={{ color: '#007bff', textDecoration: 'none' }}>
                        Mój Profil
                    </Link>
                    <button onClick={handleLogout} style={{
                        padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none',
                        borderRadius: '6px', cursor: 'pointer'
                    }}>
                        {t('logout')}
                    </button>
                </div>
            </header>

            <main style={{ padding: "20px", background: "#f4f7f9", minHeight: 'calc(100vh - 135px)' }}>
                <Outlet /> {/* Tutaj renderowane są komponenty zagnieżdżonych ścieżek */}
            </main>

            <footer style={{ textAlign: 'center', padding: '15px', background: '#333', color: '#ccc' }}>
                © {new Date().getFullYear()} {t('appTitle')}
            </footer>
        </>
    );
};

// ==================================================================
// Uproszczony Komponent Pulpitu (Dashboard)
// ==================================================================
const Dashboard = () => (
    <>
        <div style={{ display: "flex", justifyContent: "space-around", gap: "20px", flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <CurrencyConverter />
            <TransferForm />
            <DepositForm />
        </div>
        <div style={{ marginTop: "30px", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)" }}>
            <TransactionList />
        </div>
    </>
);

// ==================================================================
// Komponent chroniący ścieżki tylko dla Admina
// ==================================================================
const AdminRoute = ({ children }: { children: ReactNode }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getMe().then(user => {
            if (user?.role && Array.isArray(user.role) && user.role.includes('Admin')) {
                setIsAdmin(true);
            } else if (user?.role === 'Admin') {
                setIsAdmin(true);
            }
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <div>Sprawdzanie uprawnień...</div>;
    }

    return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};


// ==================================================================
// Główny komponent Aplikacji z nowym Routingiem
// ==================================================================
function App() {
    return (
        <Router>
            <Routes>
                {/* Ścieżki publiczne, które nie używają MainLayout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/payment-status" element={<PaymentStatusPage />} />

                {/* Ścieżki chronione, renderowane wewnątrz MainLayout */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        {/* Możesz dodać tu inne chronione ścieżki */}
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export { App };
