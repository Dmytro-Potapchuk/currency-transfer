import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import {CurrencyConverter} from './components/CurrencyConverter';
import {TransferForm} from './components/Transaction';
import {TransactionList} from './components/Transaction';
import {LoginPage, RegisterPage} from './components/LoginRegister';
import {ProtectedRoute} from './components/Route';
import {logoutUser, getMe} from './services/api';
import './App.css';

import {useTranslation} from 'react-i18next';
import {LanguageSwitcher} from './components/LanguageSwitcher';

const Dashboard = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [userDisplayInfo, setUserDisplayInfo] = useState<string | null>(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getMe();
                console.log("Данные от getMe:", userData);
                if (userData && userData.email) {
                    setUserDisplayInfo(userData.email);
                } else if (userData && userData.username) {
                    setUserDisplayInfo(userData.username);
                } else {
                    console.warn("User data, email, or username not found in getMe response", userData);
                    setUserDisplayInfo(null);
                }
            } catch (error) {
                console.error("Failed to fetch user data for dashboard:", error);
                setUserDisplayInfo(null);
            }
        };
        if (localStorage.getItem('token')) {
            fetchUser();
        }
    }, []);


    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <>
            <header style={{
                background: '#ffffff',
                padding: '15px 30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                flexWrap: 'wrap'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}> {/* Добавлен gap */}
                    <span role="img" aria-label="logo" style={{fontSize: '24px'}}>💸</span>
                    {/* Используем функцию t() для заголовка */}
                    <h1 style={{fontSize: '1.4em', margin: 0, color: '#333', whiteSpace: 'nowrap'}}>{t('appTitle')}</h1>
                    <LanguageSwitcher/> {/* Добавляем переключатель языков сюда */}
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '5px', flexWrap: 'wrap'}}>
                    {userDisplayInfo &&
                        <span style={{marginRight: '20px', color: '#555', fontSize: '0.9em'}}>{userDisplayInfo}</span>}
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9em',
                            fontWeight: 500
                        }}
                    >
                        {t('logout')}
                    </button>
                </div>
            </header>
            <main style={{padding: "20px", background: "#f4f7f9", minHeight: 'calc(100vh - 75px)'}}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    gap: "20px",
                    flexWrap: 'wrap',
                    alignItems: 'flex-start'
                }}>
                    <CurrencyConverter/>
                    <TransferForm/>
                </div>
                <div style={{
                    marginTop: "30px",
                    padding: "20px",
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)"
                }}>
                    <TransactionList/>
                </div>
            </main>
            <footer
                style={{textAlign: 'center', padding: '15px', background: '#333', color: '#ccc', fontSize: '0.85em'}}>
                © {new Date().getFullYear()} {t('appTitle')}
            </footer>
        </>
    );
};

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route element={<ProtectedRoute/>}>
                    <Route path="/*" element={<Dashboard/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export {App};