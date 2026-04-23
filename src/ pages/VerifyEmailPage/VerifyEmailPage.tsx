import { useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../ components/Header/Header.tsx';
import authStyles from '../../auth/AuthPage.module.css';
import { api } from '../../ shared/api';

type VerifyStatus = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();

    const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
    const hasToken = token.length > 0;

    const [status, setStatus] = useState<VerifyStatus>(hasToken ? 'loading' : 'error');
    const [message, setMessage] = useState(
        hasToken
            ? 'Verifying your email...'
            : 'Verification token is missing.'
    );

    useEffect(() => {
        if (!hasToken) {
            return;
        }

        let isMounted = true;

        const verifyEmail = async () => {
            try {
                await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);

                if (!isMounted) return;

                setStatus('success');
                setMessage('Your email has been successfully verified. You can now sign in.');
            } catch (error) {
                if (!isMounted) return;

                setStatus('error');

                if (isAxiosError(error)) {
                    setMessage(
                        error.response?.data?.message ??
                        'Verification failed. The link may be invalid or expired.'
                    );
                } else {
                    setMessage('An unexpected error occurred while verifying your email.');
                }
            }
        };

        verifyEmail();

        return () => {
            isMounted = false;
        };
    }, [hasToken, token]);

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
                            <h1 className={authStyles.authTitle}>
                                {status === 'loading' && 'Verifying email'}
                                {status === 'success' && 'Email verified'}
                                {status === 'error' && 'Verification failed'}
                            </h1>

                            <p className={authStyles.authSubtitle}>{message}</p>
                        </div>

                        {status === 'loading' && (
                            <button className={authStyles.authSubmit} type="button" disabled>
                                Verifying...
                            </button>
                        )}

                        {status === 'success' && (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <Link to="/login" className={authStyles.authSubmit}>
                                    Go to sign in
                                </Link>
                            </div>
                        )}

                        {status === 'error' && (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <Link to="/register" className={authStyles.authSubmit}>
                                    Go to sign up
                                </Link>

                                <Link to="/login" className={authStyles.authForgotLink}>
                                    Back to sign in
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}