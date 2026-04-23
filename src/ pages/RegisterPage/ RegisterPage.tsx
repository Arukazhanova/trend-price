import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '../../ components/Header/Header.tsx';
import authStyles from '../../auth/AuthPage.module.css';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/password.png';
import userIcon from '../../assets/admin.png';
import { api } from '../../ shared/api';
import { useAuth } from '../../auth/AuthContext.tsx';
import { registerSchema, type RegisterFormData } from '../../auth/ schemas.ts';

export default function RegisterPage() {
    const { isAuthenticated, isInitializing } = useAuth();

    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const clearMessages = () => {
        if (serverError) setServerError('');
        if (successMessage) setSuccessMessage('');
    };

    const onSubmit = async (data: RegisterFormData) => {
        setServerError('');
        setSuccessMessage('');

        try {
            await api.post('/auth/register', {
                username: data.username,
                email: data.email,
                password: data.password,
            });

            setRegisteredEmail(data.email);
            setSuccessMessage(
                'Your account has been created. We sent a verification link to your email. Please verify your email before signing in.'
            );

            reset();
        } catch (error) {
            if (isAxiosError(error)) {
                setServerError(error.response?.data?.message ?? 'Registration failed');
                return;
            }

            setServerError('An unexpected error occurred');
        }
    };

    if (isInitializing) {
        return (
            <>
                <Header />
                <div className={authStyles.authPageSection}>
                    <div className={authStyles.authPageContainer}>
                        <section className={authStyles.authCardSimple}>
                            <p className={authStyles.authSubtitle}>Loading...</p>
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
                <div className={authStyles.authPageContainer}>
                    <section className={authStyles.authCardSimple}>
                        <div className={authStyles.authBrand} aria-label="TrendPrice">
                            <span className={authStyles.authBrandAccent}>Trend</span>
                            <span className={authStyles.authBrandDark}>Price</span>
                        </div>

                        <div className={authStyles.authHeader}>
                            <h1 className={authStyles.authTitle}>Create account</h1>
                            <p className={authStyles.authSubtitle}>
                                Sign up to start monitoring prices and expenses
                            </p>
                        </div>

                        {serverError && (
                            <p className={authStyles.authServerMessage}>
                                {serverError}
                            </p>
                        )}

                        {successMessage && (
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <p className={authStyles.authSubtitle}>{successMessage}</p>

                                {registeredEmail && (
                                    <p className={authStyles.authSubtitle}>
                                        Verification email sent to: <strong>{registeredEmail}</strong>
                                    </p>
                                )}

                                <Link to="/login" className={authStyles.authSubmit}>
                                    Go to sign in
                                </Link>
                            </div>
                        )}

                        {!successMessage && (
                            <form className={authStyles.authForm} onSubmit={handleSubmit(onSubmit)} noValidate>
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

                                    {errors.username && (
                                        <p className={authStyles.authServerMessage}>
                                            {errors.username.message}
                                        </p>
                                    )}
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
                                            {...register('email', {
                                                onChange: clearMessages,
                                            })}
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className={authStyles.authServerMessage}>
                                            {errors.email.message}
                                        </p>
                                    )}
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
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            {...register('password', {
                                                onChange: clearMessages,
                                            })}
                                        />
                                    </div>

                                    {errors.password && (
                                        <p className={authStyles.authServerMessage}>
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <div className={authStyles.authField}>
                                    <label className={authStyles.authLabel} htmlFor="confirmPassword">
                                        Confirm password
                                    </label>

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
                                            {...register('confirmPassword', {
                                                onChange: clearMessages,
                                            })}
                                        />
                                    </div>

                                    {errors.confirmPassword && (
                                        <p className={authStyles.authServerMessage}>
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                <button className={authStyles.authSubmit} type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating account...' : 'Sign up'}
                                </button>
                            </form>
                        )}

                        <p className={authStyles.authFooterText}>
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}