import React, { useState, FormEvent } from 'react'; // Dodany FormEvent
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
// Import Link jeśli chcesz dodać link do rejestracji
// import { Link } from 'react-router-dom';

// 1. Zdefiniuj interfejs dla propsów oczekiwanych przez ten komponent
interface LoginPageProps {
  onLoginSuccess: () => void; // Oczekujemy funkcji, która nic nie zwraca
}

// 2. Użyj interfejsu LoginPageProps i przyjmij onLoginSuccess przez destrukturyzację
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Dodano stan ładowania
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => { // Użyj FormEvent
        e.preventDefault(); // Zapobiegaj domyślnemu przeładowaniu strony przez formularz
        setError(null);
        setIsLoading(true); // Ustaw ładowanie
        try {
            // Wywołaj funkcję API do logowania
            await loginUser({ username, password });

            // 3. Wywołaj funkcję przekazaną z App.tsx po udanym logowaniu
            onLoginSuccess();

            // Przekieruj na dashboard (lub inną chronioną stronę)
            navigate('/app'); // Upewnij się, że ta ścieżka jest poprawna

        } catch (err: any) {
            // Obsługa błędów logowania
            setError(err.response?.data?.message || 'Login failed. Please check username and password.');
            console.error('Login error:', err);
            setIsLoading(false); // Wyłącz ładowanie przy błędzie
        }
        // Nie ustawiaj isLoading na false tutaj, bo następuje przekierowanie
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading} // Wyłącz input podczas ładowania
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading} // Wyłącz input podczas ładowania
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                {error && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading} // Wyłącz przycisk podczas ładowania
                    style={{ width: '100%', padding: '12px', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: isLoading ? '#ccc' : '#3498db', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                {/* Przykład linku do rejestracji */}
                {/* <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p> */}
            </form>
        </div>
    );
};

export default LoginPage;