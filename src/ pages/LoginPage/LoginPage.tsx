import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.tsx';
import { loginSchema, type LoginFormData } from '../../auth/ schemas.ts';
import authStyles from '../../auth/AuthPage.module.css';
import Header from '../../ components/Header/Header.tsx';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/password.png';
export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, isInitializing } = useAuth();
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: {  isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError('');

        try {
            await login(data);
            navigate('/dashboard');
        } catch (error) {
            if (isAxiosError(error)) {
                setServerError(error.response?.data?.message ?? 'Sign in failed');
                return;
            }

            setServerError('An unexpected error occurred');
        }
    };

    if (isInitializing) {
        return (
            <div className={authStyles.authPageSection}>
                <div className={authStyles.authPageContainer}>
                    <section className={authStyles.authCardSimple}>
                        <p className={authStyles.authSubtitle}>Checking session...</p>
                    </section>
                </div>
            </div>
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
                        <h1 className={authStyles.authTitle}>Welcome</h1>
                        <p className={authStyles.authSubtitle}>
                            Sign in to continue monitoring prices and expenses
                        </p>
                    </div>

                    <form className={authStyles.authForm} onSubmit={handleSubmit(onSubmit)} noValidate>
                        {serverError && (
                            <p className={authStyles.authServerMessage}>
                                Incorrect username or password.
                            </p>
                        )}

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
                                        onChange: () => setServerError(''),
                                    })}
                                />
                            </div>

                        </div>

                        <div className={authStyles.authField}>
                            <div className={authStyles.authLabelRow}>
                                <label className={authStyles.authLabel} htmlFor="password">
                                    Password
                                </label>

                                <Link to="/forgot-password" className={authStyles.authForgotLink}>
                                    Forgot password?
                                </Link>
                            </div>

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
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    {...register('password', {
                                        onChange: () => setServerError(''),
                                    })}
                                />
                            </div>
                        </div>

                        <button className={authStyles.authSubmit} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>


                    <p className={authStyles.authFooterText}>
                        Don&apos;t have an account? <Link to="/register">Sign up</Link>
                    </p>
                </section>
            </div>
        </div>
        </>
    );
}