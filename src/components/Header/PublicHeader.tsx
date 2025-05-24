import React from 'react';
import { useTranslation } from 'react-i18next';
import {LanguageSwitcher} from '../LanguageSwitcher';

const PublicHeader = () => {
    const { t } = useTranslation();

    return (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span role="img" aria-label="logo" style={{ fontSize: '24px' }}>💸</span>
                <h1 style={{ fontSize: '1.4em', margin: 0, color: '#333', whiteSpace: 'nowrap' }}>
                    {t('appTitle')}
                </h1>
            </div>
            <LanguageSwitcher />
        </header>
    );
};

export {PublicHeader};