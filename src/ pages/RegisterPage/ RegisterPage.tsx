import { useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.tsx';
import { registerSchema, type RegisterFormData } from '../../auth/ schemas.ts';
import authStyles from '../../auth/AuthPage.module.css';
import styles from './RegisterPage.module.css';
import Header from '../../ components/Header/Header.tsx';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/password.png';
import nameIcon from '../../assets/admin.png';
import { api } from '../../ shared/api';

type UiState = 'idle' | 'success' | 'verifying' | 'verified';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register: registerUser, isAuthenticated, isInitializing } = useAuth();

    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [uiState, setUiState] = useState<UiState>('idle');
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onSubmit',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    });

    const isSuccessState = uiState === 'success' || uiState === 'verifying' || uiState === 'verified';
    const isFormDisabled = isSubmitting || isSuccessState;
    const canResend = useMemo(
        () => !!registeredEmail && !isResending && countdown === 0 && uiState === 'success',
        [registeredEmail, isResending, countdown, uiState]
    );

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = window.setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [countdown]);

    const clearMessages = () => {
        setServerError('');
        setSuccessMessage('');
    };

    const handleFieldChange = () => {
        if (serverError) setServerError('');
    };

    const onSubmit = async (data: RegisterFormData) => {
        setServerError('');
        setSuccessMessage('');
        setVerificationToken('');
        setRegisteredEmail('');
        setUiState('idle');

        try {
            const result = await registerUser({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            setRegisteredEmail(data.email);
            setSuccessMessage(
                result.message || 'Registration successful. Check your email to verify your account.'
            );
            setVerificationToken(result.verificationToken ?? '');
            setUiState('success');

            reset({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                acceptTerms: false,
            });
        } catch (error) {
            setUiState('idle');

            if (isAxiosError(error)) {
                setServerError(error.response?.data?.message ?? 'Registration failed');
                return;
            }

            setServerError('An unexpected error occurred');
        }
    };

    const handleVerifyEmail = async () => {
        if (!verificationToken) return;

        setServerError('');
        setUiState('verifying');

        try {
            await api.get(`/auth/verify-email?token=${encodeURIComponent(verificationToken)}`);
            setUiState('verified');
            setSuccessMessage('Email confirmed successfully. Redirecting to sign in...');

            window.setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1800);
        } catch (error) {
            setUiState('success');

            if (isAxiosError(error)) {
                setServerError(error.response?.data?.message ?? 'Email verification failed');
                return;
            }

            setServerError('An unexpected error occurred');
        }
    };

    const handleResendVerification = async () => {
        const email = registeredEmail || getValues('email');
        if (!email) {
            setServerError('Email is required to resend verification');
            return;
        }

        setServerError('');
        setIsResending(true);

        try {
            await api.post('/auth/resend-verification', { email });
            setSuccessMessage('Verification email sent again. Please check your inbox.');
            setCountdown(30);
        } catch (error) {
            if (isAxiosError(error)) {
                setServerError(error.response?.data?.message ?? 'Failed to resend verification email');
            } else {
                setServerError('An unexpected error occurred');
            }
        } finally {
            setIsResending(false);
        }
    };

    if (isInitializing) {
        return (
            <>
                <Header />
                <div className={authStyles.authPageSection}>
                    <div className={authStyles.authPageContainer}>
                        <section className={authStyles.authCardSimple}>
                            <p className={authStyles.authSubtitle}>Checking session...</p>
                        </section>
                    </div>
                </div>
            </>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Header />

            <div className={authStyles.authPageSection}>
                <div className={`${authStyles.authPageContainer} ${styles.registerContainer}`}>
                    <section className={`${authStyles.authCardSimple} ${styles.registerCard}`}>
                        <div className={authStyles.authBrand} aria-label="TrendPrice">
                            <span className={authStyles.authBrandAccent}>Trend</span>
                            <span className={authStyles.authBrandDark}>Price</span>
                        </div>

                        <div className={authStyles.authHeader}>
                            <h1 className={authStyles.authTitle}>Create Account</h1>
                            <p className={authStyles.authSubtitle}>
                                Sign up to continue monitoring prices and expenses
                            </p>
                        </div>

                        {serverError && (
                            <p className={authStyles.authServerMessage}>
                                {serverError}
                            </p>
                        )}

                        {successMessage && (
                            <p className={authStyles.authSubtitle}>{successMessage}</p>
                        )}

                        {!isSuccessState && (
                            <form
                                className={`${authStyles.authForm} ${styles.registerForm}`}
                                onSubmit={handleSubmit(onSubmit)}
                                noValidate
                            >
                                <div className={authStyles.authField}>
                                    <label className={authStyles.authLabel} htmlFor="username">
                                        Username
                                    </label>

                                    <div className={authStyles.authInputWrap}>
                                        <img
                                            src={nameIcon}
                                            alt=""
                                            className={authStyles.authInputIcon}
                                            aria-hidden="true"
                                        />
                                        <input
                                            id="username"
                                            type="text"
                                            className={authStyles.authInput}
                                            placeholder="Enter your username"
                                            autoComplete="username"
                                            disabled={isFormDisabled}
                                            {...register('username', {
                                                onChange: handleFieldChange,
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className={authStyles.authField}>
                                    <label className={authStyles.authLabel} htmlFor="email">
                                        Email
                                    </label>

                                    <div className={authStyles.authInputWrap}>
                                        <img
                                            src={emailIcon}
                                            alt=""
                                            className={authStyles.authInputIcon}
                                            aria-hidden="true"
                                        />
                                        <input
                                            id="email"
                                            type="email"
                                            className={authStyles.authInput}
                                            placeholder="Enter your email"
                                            autoComplete="email"
                                            disabled={isFormDisabled}
                                            {...register('email', {
                                                onChange: handleFieldChange,
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className={authStyles.authField}>
                                    <label className={authStyles.authLabel} htmlFor="password">
                                        Password
                                    </label>

                                    <div className={authStyles.authInputWrap}>
                                        <img
                                            src={passwordIcon}
                                            alt=""
                                            className={authStyles.authInputIcon}
                                            aria-hidden="true"
                                        />
                                        <input
                                            id="password"
                                            type="password"
                                            className={authStyles.authInput}
                                            placeholder="Create your password"
                                            autoComplete="new-password"
                                            disabled={isFormDisabled}
                                            {...register('password', {
                                                onChange: handleFieldChange,
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className={authStyles.authField}>
                                    <div className={authStyles.authInputWrap}>
                                        <img
                                            src={passwordIcon}
                                            alt=""
                                            className={authStyles.authInputIcon}
                                            aria-hidden="true"
                                        />
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            className={authStyles.authInput}
                                            placeholder="Repeat your password"
                                            autoComplete="new-password"
                                            disabled={isFormDisabled}
                                            {...register('confirmPassword', {
                                                onChange: handleFieldChange,
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.authCheckboxField}>
                                    <label className={styles.authCheckboxLabel} htmlFor="acceptTerms">
                                        <input
                                            id="acceptTerms"
                                            type="checkbox"
                                            className={styles.authCheckboxInput}
                                            disabled={isFormDisabled}
                                            {...register('acceptTerms')}
                                        />

                                        <span className={styles.authCheckboxText}>
                                            I agree to the{' '}
                                            <a
                                                href="/documents/user-agreement.pdf"
                                                target="_blank"
                                                rel="noreferrer"
                                                className={styles.authCheckboxLink}
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                User Agreement
                                            </a>{' '}
                                            and the{' '}
                                            <a
                                                href="/documents/privacy-policy.pdf"
                                                target="_blank"
                                                rel="noreferrer"
                                                className={styles.authCheckboxLink}
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                Privacy Policy
                                            </a>
                                            .
                                        </span>
                                    </label>
                                </div>

                                <button
                                    className={authStyles.authSubmit}
                                    type="submit"
                                    disabled={isFormDisabled}
                                >
                                    {isSubmitting ? 'Creating account...' : 'Sign up'}
                                </button>
                            </form>
                        )}

                        {uiState === 'success' && (
                            <div className={styles.registerActions}>
                                {verificationToken && (
                                    <button
                                        className={authStyles.authSubmit}
                                        type="button"
                                        onClick={handleVerifyEmail}
                                    >
                                        Confirm email
                                    </button>
                                )}

                                <button
                                    className={authStyles.authSubmit}
                                    type="button"
                                    onClick={handleResendVerification}
                                    disabled={!canResend}
                                >
                                    {isResending
                                        ? 'Sending...'
                                        : countdown > 0
                                            ? `Resend in ${countdown}s`
                                            : 'Resend email'}
                                </button>

                                <button
                                    className={authStyles.authSubmit}
                                    type="button"
                                    onClick={() => navigate('/login')}
                                >
                                    Go to sign in
                                </button>
                            </div>
                        )}

                        {uiState === 'verifying' && (
                            <div className={styles.registerActions}>
                                <p className={authStyles.authSubtitle}>Confirming your email...</p>
                            </div>
                        )}

                        {uiState === 'verified' && (
                            <div className={styles.registerActions}>
                                <p className={authStyles.authSubtitle}>
                                    Email verified. Redirecting to sign in...
                                </p>
                            </div>
                        )}

                        <p className={authStyles.authFooterText}>
                            Already have an account? <Link to="/login" onClick={clearMessages}>Sign in</Link>
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}