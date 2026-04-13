import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => (
    <div className="auth-page">
        <div className="auth-card">
            <div className="auth-logo">⭐</div>
            <h1 className="auth-title">Join RateSphere</h1>
            <p className="auth-subtitle">Create your free account</p>
            <RegisterForm />
        </div>
    </div>
);

export default RegisterPage;
