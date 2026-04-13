import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => (
    <div className="auth-page">
        <div className="auth-card">
            <div className="auth-logo">⭐</div>
            <h1 className="auth-title">RateSphere</h1>
            <p className="auth-subtitle">Sign in to your account</p>
            <LoginForm />
            <p className="auth-switch">
                New user? <a href="/register">Create an account</a>
            </p>
        </div>
    </div>
);

export default LoginPage;
