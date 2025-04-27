import React from 'react';
import './Notification.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    return (
        <div className={`notification ${type}`}>
            <div className="notification-content">
                <p>{message}</p>
                <button onClick={onClose} className="close-btn">X</button>
            </div>
        </div>
    );
};
