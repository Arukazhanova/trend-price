import { useState } from 'react';
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
export default function RegisterPage() {
    const navigate = useNavigate();
    const { register: registerUser, isAuthenticated, isInitializing } = useAuth();
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: {  isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError('');

        try {
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            navigate('/dashboard');
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

                        <form
                            className={`${authStyles.authForm} ${styles.registerForm}`}
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                        >
                            {serverError && (
                                <p className={authStyles.authServerMessage}>
                                    Registration failed. Please try again.
                                </p>
                            )}

                            <div className={authStyles.authField}>
                                <label className={authStyles.authLabel} htmlFor="name">
                                    Full Name
                                </label>

                                <div className={authStyles.authInputWrap}>
                                    <img
                                        src={nameIcon}
                                        alt=""
                                        className={authStyles.authInputIcon}
                                        aria-hidden="true"
                                    />

                                    <input
                                        id="name"
                                        type="text"
                                        className={authStyles.authInput}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        {...register('name', {
                                            onChange: () => setServerError(''),
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
                                        {...register('email', {
                                            onChange: () => setServerError(''),
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
                                        {...register('password', {
                                            onChange: () => setServerError(''),
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
                                        {...register('confirmPassword', {
                                            onChange: () => setServerError(''),
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

                            <button className={authStyles.authSubmit} type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating account...' : 'Sign up'}
                            </button>
                        </form>

                        <p className={authStyles.authFooterText}>
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}