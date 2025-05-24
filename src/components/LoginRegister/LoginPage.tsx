import React, { useState, FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../../services/api';
import {PublicHeader} from "../Header";

const LoginPage = () => {
    const { t } = useTranslation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        try {
            await loginUser({ username: username.trim(), password });
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error("Login failed on LoginPage:", err);
            const apiErrorMessage = err?.response?.data?.detail || err?.response?.data?.message;
            if (apiErrorMessage) {
                setError(apiErrorMessage); // Отображаем ошибку от API как есть
            } else if (err?.isAxiosError && !err?.response) {
                setError(t('errorNetworkOrServer')); // Переводим ошибку сети
            } else {
                setError(t('errorLoginDefault')); // Переводим общую ошибку входа
            }
        }
    };

    return (
        <div>
            <PublicHeader />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '20px', minHeight: 'calc(80vh - 70px)' /* Примерный отступ от хедера */ }}>
                <div style={{ width: '100%', maxWidth: '400px', padding: '30px', background: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: '10px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
                        {t('loginTitle')}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="username-login" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
                                {t('usernameLabel')}: {/* <--- 3. ПЕРЕВОД */}
                            </label>
                            <input
                                type="text"
                                id="username-login"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder={t('usernameLabel')} // Плейсхолдер тоже можно перевести
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label htmlFor="password-login" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
                                {t('passwordLabel')}: {/* <--- 3. ПЕРЕВОД */}
                            </label>
                            <input
                                type="password"
                                id="password-login"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder={t('passwordLabel')} // Плейсхолдер
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                            />
                        </div>
                        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px', fontSize: '0.9em' }}>{error}</p>} {/* Ошибка от API или переведенная общая ошибка */}
                        <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1em', fontWeight: 500 }}>
                            {t('loginButton')} {/* <--- 3. ПЕРЕВОД */}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
                        {t('noAccount')}
                        <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', marginLeft: '5px' }}>
                            {t('registerButton')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export {LoginPage};