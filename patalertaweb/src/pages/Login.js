import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🐾 PataAlerta</div>
        <h2 className="auth-title">Entrar</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email" placeholder="seu@email.com" required
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label>Senha</label>
            <input
              type="password" placeholder="••••••" required
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}
