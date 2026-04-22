import { useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../ components/Header/Header';
import { api } from '../../ shared/api';
import authStyles from '../../auth/AuthPage.module.css';

type VerifyStatus = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);

    const hasToken = Boolean(token);

    const [status, setStatus] = useState<VerifyStatus>(
        hasToken ? 'loading' : 'error'
    );

    const [message, setMessage] = useState(
        hasToken
            ? 'Verifying your email...'
            : 'Verification token is missing.'
    );

    const [username, setUsername] = useState('');
    useEffect(() => {
        console.log('VerifyEmailPage mounted');
        console.log('token =', token);

        if (!token) return;

        const verifyEmail = async () => {
            console.log('sending verify request');

            try {
                const response = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
                console.log('verify success', response.data);

                setStatus('success');
                setMessage(response.data?.message ?? 'Email verified successfully.');
                setUsername(response.data?.username ?? '');

                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 1800);
            } catch (error) {
                console.log('verify error', error);

                setStatus('error');

                if (isAxiosError(error)) {
                    const responseStatus = error.response?.status;
                    const backendMessage = error.response?.data?.message;

                    if (responseStatus === 400) {
                        setMessage(
                            backendMessage ?? 'This verification link is invalid, expired, or has already been used.'
                        );
                        return;
                    }

                    if (responseStatus === 404) {
                        setMessage('Verification token was not found.');
                        return;
                    }

                    setMessage(backendMessage ?? 'Email verification failed.');
                    return;
                }

                setMessage('An unexpected error occurred.');
            }
        };

        void verifyEmail();
    }, [token, navigate]);

    return (
        <>
            <Header />

            <div className={authStyles.authPageSection}>
                <div className={authStyles.authPageContainer}>
                    <section className={authStyles.authCardSimple}>
                        <div className={authStyles.authBrand} aria-label="TrendPrice">
                            <span className={authStyles.authBrandAccent}>Trend</span>
                            <span className={authStyles.authBrandDark}>Price</span>
                        </div>

                        <div className={authStyles.authHeader}>
                            <h1 className={authStyles.authTitle}>Email verification</h1>
                            <p className={authStyles.authSubtitle}>
                                {status === 'loading' && 'Please wait while we verify your email.'}
                                {status === 'success' && 'Your email has been confirmed successfully.'}
                                {status === 'error' && 'We could not verify your email.'}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            <p className={status === 'error' ? authStyles.authServerMessage : authStyles.authSubtitle}>
                                {message}
                            </p>

                            {status === 'success' && username && (
                                <p className={authStyles.authSubtitle}>
                                    Welcome, <strong>{username}</strong>.
                                </p>
                            )}

                            {status === 'success' && (
                                <p className={authStyles.authSubtitle}>
                                    Redirecting to sign in...
                                </p>
                            )}

                            {status === 'error' && (
                                <p className={authStyles.authFooterText}>
                                    You can go back to <Link to="/register">Sign up</Link> or{' '}
                                    <Link to="/login">Sign in</Link>.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}