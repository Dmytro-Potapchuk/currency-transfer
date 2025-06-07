import React, { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile, deleteMyAccount, UpdateUserProfileData, logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UpdateUserProfileData>({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userProfile = await getMyProfile();
                setFormData({
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    email: userProfile.email,
                });
            } catch (err) {
                alert('Nie udało się pobrać danych profilu.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMyProfile(formData);
            alert('Profil zaktualizowany pomyślnie!');
        } catch (err) { /* handleError w api.ts już wyświetli alert */ }
    };

    const handleDelete = async () => {
        try {
            await deleteMyAccount();
            alert('Konto zostało usunięte.');
            logoutUser();
            navigate('/login');
        } catch (err) { /* Anulowanie lub błąd */ }
    };

    if (isLoading) return <div>Ładowanie profilu...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <h2>Zarządzaj profilem</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Imię:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: '100%', padding: '8px' }}/>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Nazwisko:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%', padding: '8px' }}/>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px' }}/>
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>Zapisz zmiany</button>
            </form>

            <hr style={{ margin: '30px 0' }}/>
            <h3>Strefa niebezpieczna</h3>
            <button onClick={handleDelete} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none' }}>
                Usuń moje konto
            </button>
        </div>
    );
};

export default ProfilePage;
