import { useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.tsx';
import { loginSchema, type LoginFormData } from '../../auth/ schemas.ts';
import authStyles from '../../auth/AuthPage.module.css';
import Header from '../../ components/Header/Header.tsx';
import userIcon from '../../assets/User-Grey.svg';
import passwordIcon from '../../assets/LockKey.svg';
import { api } from '../../ shared/api';
import eyeIcon from '../../assets/eye.svg';
import eyeClosedIcon from '../../assets/eye-crossed.svg';
export default function LoginPage() {
    const navigate = useNavigate();
    const {login, isAuthenticated, isInitializing} = useAuth();

    const [serverError, setServerError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [emailForResend, setEmailForResend] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {isSubmitting},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const canResendVerification = useMemo(() => {
        return serverError.toLowerCase().includes('email is not verified');
    }, [serverError]);

    const clearMessages = () => {
        if (serverError) setServerError('');
        if (infoMessage) setInfoMessage('');
    };

    const onSubmit = async (data: LoginFormData) => {
        setServerError('');
        setInfoMessage('');

        try {
            const loggedUser = await login(data);

            const roles = loggedUser?.roles ?? [];

            if (roles.includes('ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            if (isAxiosError(error)) {
                setServerError(error.response?.data?.message ?? 'Sign in failed');
                return;
            }

            setServerError('An unexpected error occurred');
        }
    };

    const handleResendVerification = async () => {
        setServerError('');
        setInfoMessage('');

        const email = emailForResend.trim();

        if (!email) {
            setServerError('Enter your email to resend verification.');
            return;
        }

        setIsResending(true);

        try {
            await api.post('/auth/resend-verification', {email});
            setInfoMessage('Verification email sent. Please check your inbox.');
        } catch (error) {
            if (isAxiosError(error)) {
                setServerError(
                    error.response?.data?.message ?? 'Failed to resend verification email'
                );
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
                <Header/>
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
        return <Navigate to="/dashboard" replace/>;
    }

    return (
        <>
            <Header/>

            <div className={authStyles.authPageSection}>
                <div className={authStyles.authPageContainer}>
                    <section className={authStyles.authCardSimple}>
                        <div className={authStyles.authBrand} aria-label="TrendPrice">
                            <span className={authStyles.authBrandAccent}>Trend</span>
                            <span className={authStyles.authBrandDark}>Price</span>
                        </div>

                        <div className={authStyles.authHeader}>
                            <h1 className={authStyles.authTitle}>Welcome back</h1>
                            <p className={authStyles.authSubtitle}>
                                Sign in to continue monitoring prices and expenses
                            </p>
                        </div>

                        {serverError && (
                            <p className={authStyles.authServerMessage}>
                                {serverError}
                            </p>
                        )}

                        {infoMessage && (
                            <p className={authStyles.authSubtitle}>
                                {infoMessage}
                            </p>
                        )}

                        <form
                            className={authStyles.authForm}
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                        >
                            <div className={authStyles.authField}>
                                <label className={authStyles.authLabel} htmlFor="username">
                                    Username
                                </label>

                                <div className={authStyles.authInputWrap}>
                                    <img
                                        src={userIcon}
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
                                        {...register('username', {
                                            onChange: clearMessages,
                                        })}
                                    />
                                </div>
                            </div>

                            <div className={authStyles.authField}>
                                <div className={authStyles.authLabelRow}>
                                    <label className={authStyles.authLabel} htmlFor="password">
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className={authStyles.authForgotLink}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className={authStyles.authInputWrap}>
                                    <div className={authStyles.passwordField}>
                                        <img
                                            src={passwordIcon}
                                            alt=""
                                            className={authStyles.authInputIcon}
                                            aria-hidden="true"
                                        />

                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            className={authStyles.authInput}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            {...register('password', {
                                                onChange: clearMessages,
                                            })}
                                        />

                                        <button
                                            type="button"
                                            className={authStyles.eyeButton}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <img
                                                src={showPassword ? eyeIcon : eyeClosedIcon}
                                                alt=""
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={authStyles.authSubmit}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        {canResendVerification && (
                            <div style={{marginTop: '12px', display: 'grid', gap: '10px'}}>
                                <input
                                    type="email"
                                    className={authStyles.authInput}
                                    placeholder="Enter your email"
                                    value={emailForResend}
                                    onChange={(e) => setEmailForResend(e.target.value)}
                                />

                                <button
                                    className={authStyles.authSubmit}
                                    type="button"
                                    onClick={handleResendVerification}
                                    disabled={isResending}
                                >
                                    {isResending ? 'Sending...' : 'Resend verification email'}
                                </button>
                            </div>
                        )}

                        <p className={authStyles.authFooterText}>
                            Don&apos;t have an account? <Link to="/register">Sign up</Link>
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}