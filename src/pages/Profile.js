import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/auth/me').then(r => {
      setName(r.data.name || '');
      setPhone(r.data.phone || '');
    }).catch(() => {});
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    api.put('/auth/me', { name, phone })
      .then(() => {
        setSuccess('Perfil atualizado!');
        setTimeout(() => setSuccess(''), 3000);
        if (user) { user.name = name; }
      })
      .catch(e => setError(e.response?.data?.message || 'Erro ao atualizar'));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!currentPassword || !newPassword) return;
    api.patch('/auth/me/password', { currentPassword, newPassword })
      .then(() => {
        setSuccess('Senha alterada!');
        setCurrentPassword(''); setNewPassword('');
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(e => setError(e.response?.data?.message || 'Erro ao alterar senha'));
  };

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
        <span style={{fontSize:'1.4rem'}}>👤</span>
        <h2 style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.3rem', color:'#3D2B1A', margin:0}}>Perfil</h2>
      </div>

      {error && <div style={{background:'#FEF2F2', borderRadius:'10px', padding:'8px 12px', fontSize:'0.75rem', color:'#991B1B', marginBottom:'12px'}}>{error}</div>}
      {success && <div style={{background:'#F0FDF4', borderRadius:'10px', padding:'8px 12px', fontSize:'0.75rem', color:'#065F46', marginBottom:'12px'}}>{success}</div>}

      {/* Profile info */}
      <div style={{background:'white', borderRadius:'16px', padding:'16px', marginBottom:'14px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
        <div style={{fontWeight:700, fontSize:'0.85rem', color:'#6B4226', marginBottom:'12px'}}>Informações da conta</div>
        <form onSubmit={handleUpdateProfile}>
          <div style={{display:'grid', gap:'10px'}}>
            <div>
              <div style={{fontSize:'0.65rem', fontWeight:700, color:'#9A7050', marginBottom:'3px'}}>E-mail</div>
              <input value={user?.email || ''} disabled
                style={{width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', background:'#F5F0EB', color:'#9A7050'}} />
            </div>
            <div>
              <div style={{fontSize:'0.65rem', fontWeight:700, color:'#9A7050', marginBottom:'3px'}}>Nome</div>
              <input value={name} onChange={e => setName(e.target.value)}
                style={{width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
            </div>
            <div>
              <div style={{fontSize:'0.65rem', fontWeight:700, color:'#9A7050', marginBottom:'3px'}}>Telefone</div>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999"
                style={{width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
            </div>
            <button type="submit" style={{background:'#F97316', color:'white', border:'none', borderRadius:'30px', padding:'10px', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div style={{background:'white', borderRadius:'16px', padding:'16px', marginBottom:'14px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
        <div style={{fontWeight:700, fontSize:'0.85rem', color:'#6B4226', marginBottom:'12px'}}>Alterar senha</div>
        <form onSubmit={handleChangePassword}>
          <div style={{display:'grid', gap:'10px'}}>
            <input type="password" placeholder="Senha atual" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
            <input type="password" placeholder="Nova senha (mínimo 6 caracteres)" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
            <button type="submit" style={{background:'#6B4226', color:'white', border:'none', borderRadius:'30px', padding:'10px', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
              Alterar Senha
            </button>
          </div>
        </form>
      </div>

      {/* Plan info */}
      <div style={{background:'white', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
        <div style={{fontWeight:700, fontSize:'0.85rem', color:'#6B4226', marginBottom:'8px'}}>Plano</div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <span style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.1rem', color:'#3D2B1A'}}>{user?.plan || 'FREE'}</span>
            <span style={{fontSize:'0.7rem', color:'#9A7050', marginLeft:'6px'}}>
              {user?.plan === 'FREE' ? '• 1 pet' : user?.plan === 'PRO' ? '• 3 pets' : '• Pets ilimitados'}
            </span>
          </div>
          <span style={{fontSize:'0.7rem', fontWeight:700, color:'#F97316', cursor:'pointer'}}>Gerenciar →</span>
        </div>
      </div>
    </div>
  );
}
