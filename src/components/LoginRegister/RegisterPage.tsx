import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../../services/api';
import {PublicHeader} from "../Header";

const RegisterPage = () => {
    const { t } = useTranslation();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError(t('errorPasswordMinLength')); // <--- 3. ПЕРЕВОД
            return;
        }
        if (!username.trim()) {
            setError(t('errorUsernameRequired')); // <--- 3. ПЕРЕВОД
            return;
        }

        const userData = {
            username: username.trim(),
            email: email.trim(),
            password: password,
            firstName: firstName.trim(),
            lastName: lastName.trim()
        };

        try {
            await registerUser(userData);
            alert(t('registrationSuccessAlert'));
            navigate('/login');
        } catch (err: any) {
            console.error("Registration failed on RegisterPage:", err);
            let specificErrorMessage = "";
            const errorData = err.response?.data;

            if (errorData) {
                if (errorData.errors && Object.keys(errorData.errors).length > 0) {
                    const messages = Object.values(errorData.errors).flat();
                    specificErrorMessage = (messages as string[]).join(' ');
                } else if (errorData.detail) {
                    specificErrorMessage = errorData.detail;
                } else if (typeof errorData === 'string') {
                    specificErrorMessage = errorData;
                } else if (errorData.title) {
                    specificErrorMessage = errorData.title;
                }
            }

            if (!specificErrorMessage && err.message) {
                specificErrorMessage = err.message;
            }

            if (!specificErrorMessage) {
                specificErrorMessage = t('errorRegistrationDefault');
            }

            if (err.isAxiosError && !err.response) {
                specificErrorMessage = t('errorNetworkOrServer');
            }

            setError(specificErrorMessage);
        }
    };

    return (
        <div> {/* Обертка */}
            <PublicHeader />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '20px', minHeight: 'calc(80vh - 70px)' }}>
                <div style={{ width: '100%', maxWidth: '450px', padding: '30px', background: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderRadius: '10px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
                        {t('registerTitle')} {/* <--- 3. ПЕРЕВОД */}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="username-register" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
                                {t('usernameLabel')}: {/* <--- 3. ПЕРЕВОД */}
                            </label>
                            <input type="text" id="username-register" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder={t('usernameLabel')} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="firstName-register" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
                                {t('firstNameLabel')}: {/* <--- 3. ПЕРЕВОД */}
                            </label>
                            <input type="text" id="firstName-register" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder={t('firstNameLabel')} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="lastName-register" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
                                {t('lastNameLabel')}: {/* <--- 3. ПЕРЕВОД */}
                            </label>
                            <input type="text" id="lastName-register" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder={t('lastNameLabel')} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="reg-email" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
                                {t('emailLabel')}: {/* <--- 3. ПЕРЕВОД */}
                            </label>
                            <input type="email" id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t('emailLabel')} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label htmlFor="reg-password" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#555' }}>
                                {t('passwordLabel')}: {/* <--- 3. ПЕРЕВОД */}
                            </label>
                            <input type="password" id="reg-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={t('passwordLabel')} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>
                        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px', fontSize: '0.9em' }}>{error}</p>}
                        <button type="submit" style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1em', fontWeight: 500 }}>
                            {t('registerButton')} {/* <--- 3. ПЕРЕВОД */}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
                        {t('haveAccount')} {/* <--- 3. ПЕРЕВОД */}
                        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', marginLeft: '5px' }}>
                            {t('loginButton')} {/* <--- 3. ПЕРЕВОД (для текста "Войти") */}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export {RegisterPage};