import React from 'react';
import { useTranslation } from 'react-i18next';


import { ReactComponent as GbFlag } from '../../svg/gb.svg';
import { ReactComponent as PlFlag } from '../../svg/pl.svg';
import { ReactComponent as RuFlag } from '../../svg/ru.svg';
import { ReactComponent as UaFlag } from '../../svg/ua.svg';

const languages = [
    { code: 'en', name: 'English', FlagComponent: GbFlag },
    { code: 'pl', name: 'Polski',  FlagComponent: PlFlag },
    { code: 'uk', name: 'Українська', FlagComponent: UaFlag },
    { code: 'ru', name: 'Русский', FlagComponent: RuFlag },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {languages.map((lang) => {
                // Получаем компонент флага для текущего языка
                const CurrentFlag = lang.FlagComponent;
                return (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        disabled={i18n.resolvedLanguage === lang.code}
                        title={lang.name}
                        style={{
                            padding: '5px',
                            border: i18n.resolvedLanguage === lang.code ? '2px solid #007bff' : '2px solid transparent',
                            background: 'none',
                            cursor: 'pointer',
                            lineHeight: 0,
                        }}
                    >
                        <CurrentFlag style={{ width: '30px', height: '20px', display: 'block' }} />
                    </button>
                );
            })}
        </div>
    );
};

export  {LanguageSwitcher};