// src/components/PaymentStatusPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPayUPaymentStatus, PayUPaymentStatus } from '../../services/api';
import {PublicHeader} from "../Header";


const PaymentStatusPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState<PayUPaymentStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = searchParams.get('orderId');
    // const initialStatus = searchParams.get('status'); // status z redirectUri

    useEffect(() => {
        if (orderId) {
            const fetchStatus = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    // Czekamy chwilę, aby symulować czas przetwarzania i dać szansę PayUService zmienić status
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Czekaj 2 sekundy
                    const statusResult = await getPayUPaymentStatus(orderId);
                    setPaymentStatus(statusResult);
                    if (statusResult.status === "COMPLETED") {
                        // Można tu wywołać odświeżenie danych konta użytkownika, jeśli potrzebne globalnie
                        // np. poprzez event lub odświeżenie danych w Context/Redux
                    }
                } catch (err: any) {
                    const apiError = err?.response?.data?.message || err?.message || t('errorFetchingPaymentStatus');
                    setError(apiError);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchStatus();
        } else {
            setError(t('errorNoOrderId'));
            setIsLoading(false);
        }
    }, [orderId, t]);

    return (
        <>
            <PublicHeader />
            <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h2>{t('paymentStatusTitle')}</h2> {/* paymentStatusTitle: "Payment Status" */}
                {isLoading && <p>{t('loadingPaymentStatus')}</p>} {/* loadingPaymentStatus: "Loading payment status..." */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {paymentStatus && (
                    <div>
                        <p><strong>{t('orderIdLabel')}:</strong> {paymentStatus.orderId}</p> {/* orderIdLabel: "Order ID" */}
                        <p><strong>{t('statusLabel')}:</strong> {paymentStatus.status}</p> {/* statusLabel: "Status" */}
                        {paymentStatus.amount && paymentStatus.currencyCode && (
                            <p><strong>{t('amountLabel')}:</strong> {paymentStatus.amount.toFixed(2)} {paymentStatus.currencyCode}</p>
                        )}

                        {paymentStatus.status === "COMPLETED" && (
                            <p style={{ color: 'green', fontWeight: 'bold' }}>{t('paymentCompletedAccountCredited')}</p>
                            // paymentCompletedAccountCredited: "Payment completed successfully! Your account should be credited."
                        )}
                        {paymentStatus.status === "PENDING" && (
                            <p style={{ color: 'orange' }}>{t('paymentPending')}</p>
                            // paymentPending: "Payment is still pending. Please check back later or refresh."
                        )}
                        {paymentStatus.status && (paymentStatus.status.startsWith("FAILED") || paymentStatus.status === "CANCELED") && (
                            <p style={{ color: 'red', fontWeight: 'bold' }}>{t('paymentFailed')}</p>
                            // paymentFailed: "Payment failed or was canceled."
                        )}
                        {paymentStatus.status === "NOT_FOUND" && (
                            <p style={{ color: 'red', fontWeight: 'bold' }}>{t('orderNotFound')}</p>
                            // orderNotFound: "Order not found."
                        )}
                    </div>
                )}
                <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 15px' }}>
                    {t('backToDashboardButton')} {/* backToDashboardButton: "Back to Dashboard" */}
                </button>
            </div>
        </>
    );
};

export default PaymentStatusPage;