import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/app');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const msgs = Object.values(data.errors).join(', ');
        setError(msgs);
      } else {
        setError(data?.message || 'Erro ao cadastrar');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🐾 PataAlerta</div>
        <h2 className="auth-title">Criar conta</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Nome</label>
            <input
              type="text" placeholder="Seu nome" required
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              type="password" placeholder="Mínimo 6 caracteres" required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar grátis'}
          </button>
        </form>

        <div className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
