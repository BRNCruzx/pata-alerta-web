import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePet } from '../contexts/PetContext';
import api from '../services/api';

const isMobile = /Android|iPhone|iPad|iPod|webOS|IEMobile|Opera Mini/i.test(navigator.userAgent);

const WEB_MAX_WIDTH = 1400;

const navItems = [
  { path: '/app', icon: '🏠', label: 'Início' },
  { path: '/app/vaccines', icon: '💉', label: 'Vacinas' },
  { path: '/app/food', icon: '🍖', label: 'Ração' },
  { path: '/app/walks', icon: '🚶', label: 'Passeio' },
  { path: '/app/vet', icon: '🏥', label: 'Vet' },
];

const mobileNav = [
  { path: '/app', icon: '🏠', label: 'Início' },
  { path: '/app/schedule', icon: '📅', label: 'Agenda' },
  { path: '/app', icon: '🐾', label: 'Pets' },
  { path: '/app/alerts', icon: '🔔', label: 'Alertas' },
  { path: '/app/profile', icon: '👤', label: 'Perfil' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { selectedPet, setSelectedPet, pets, setPets } = usePet();
  const navigate = useNavigate();
  const location = useLocation();
  const [health, setHealth] = useState(null);
  const [showPetForm, setShowPetForm] = useState(false);
  const [petEmoji, setPetEmoji] = useState('🐕');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petError, setPetError] = useState('');

  const petEmojis = ['🐕', '🐱', '🐦', '🐰', '🐹', '🐠'];

  useEffect(() => {
    if (!selectedPet) return;
    api.get(`/activities/pet/${selectedPet.id}/health`).then(r => setHealth(r.data)).catch(() => {});
  }, [selectedPet]);

  const healthScore = health ? health.healthScore : 0;

  const handleLogout = () => { logout(); navigate('/'); };

  const handleAddPet = (e) => {
    e.preventDefault();
    if (!petName || !petBreed || !petAge) {
      setPetError('Preencha nome, raça e idade');
      return;
    }
    api.post('/pets', { name: petName, breed: petBreed, age: parseInt(petAge), weight: petWeight ? parseFloat(petWeight) : null })
      .then(r => {
        setPets(prev => [...prev, { ...r.data, emoji: petEmoji }]);
        setSelectedPet({ ...r.data, emoji: petEmoji });
        setPetEmoji('🐕'); setPetName(''); setPetBreed(''); setPetAge(''); setPetWeight(''); setPetError('');
        setShowPetForm(false);
      })
      .catch(e => setPetError(e.response?.data?.message || 'Erro ao cadastrar pet'));
  };

  const PetFormModal = () => showPetForm ? (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:'20px'}}
      onClick={(e) => { if (e.target === e.currentTarget) setShowPetForm(false); }}>
      <div style={{background:'white', borderRadius:'24px', padding:'28px 24px', width:'100%', maxWidth:'420px', boxShadow:'0 20px 60px rgba(0,0,0,0.2)', maxHeight:'90vh', overflowY:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
          <span style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.1rem', color:'#3D2B1A'}}>🐾 Novo Pet</span>
          <span onClick={() => setShowPetForm(false)} style={{cursor:'pointer', fontSize:'1.2rem', color:'#9A7050', width:'28px', height:'28px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%', background:'#FEF3C7'}}>✕</span>
        </div>

        <form onSubmit={handleAddPet}>
          <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
            {petError && <div style={{background:'#FEF2F2', borderRadius:'12px', padding:'10px 12px', fontSize:'0.8rem', color:'#991B1B', border:'1px solid #FECACA'}}>{petError}</div>}

            {/* Emoji Selector */}
            <div style={{background:'white', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 12px rgba(249,115,22,0.08)'}}>
              <div style={{fontFamily:"'Fredoka One', cursive", fontSize:'0.85rem', color:'#3D2B1A', marginBottom:'10px', textAlign:'center'}}>Qual o tipo do seu pet?</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'6px'}}>
                {petEmojis.map(e => (
                  <div key={e} onClick={() => setPetEmoji(e)}
                    style={{fontSize:'1.5rem', textAlign:'center', padding:'8px 4px', borderRadius:'12px', cursor:'pointer',
                      background: petEmoji === e ? '#F97316' : '#FEF3C7',
                      transition:'all 0.15s',
                      transform: petEmoji === e ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: petEmoji === e ? '0 2px 8px rgba(249,115,22,0.3)' : 'none'}}>
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {/* Informações Básicas */}
            <div style={{background:'white', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 12px rgba(249,115,22,0.08)'}}>
              <div style={{fontFamily:"'Fredoka One', cursive", fontSize:'0.85rem', color:'#3D2B1A', marginBottom:'12px'}}>📋 Informações Básicas</div>
              <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <div>
                  <label style={{fontSize:'0.75rem', fontWeight:700, color:'#9A7050', display:'block', marginBottom:'3px'}}>NOME</label>
                  <input placeholder="Digite o nome do pet" value={petName} onChange={e => setPetName(e.target.value)}
                    style={{width:'100%', boxSizing:'border-box', padding:'11px 14px', borderRadius:'12px', border:'2px solid transparent', fontSize:'0.85rem', fontFamily:'inherit', outline:'none', background:'#FEF3C7', transition:'border 0.15s'}}
                    onFocus={e => e.target.style.borderColor = '#F97316'}
                    onBlur={e => e.target.style.borderColor = 'transparent'} />
                </div>
                <div>
                  <label style={{fontSize:'0.75rem', fontWeight:700, color:'#9A7050', display:'block', marginBottom:'3px'}}>RAÇA</label>
                  <input placeholder="Ex: Golden Retriever" value={petBreed} onChange={e => setPetBreed(e.target.value)}
                    style={{width:'100%', boxSizing:'border-box', padding:'11px 14px', borderRadius:'12px', border:'2px solid transparent', fontSize:'0.85rem', fontFamily:'inherit', outline:'none', background:'#FEF3C7', transition:'border 0.15s'}}
                    onFocus={e => e.target.style.borderColor = '#F97316'}
                    onBlur={e => e.target.style.borderColor = 'transparent'} />
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <div>
                    <label style={{fontSize:'0.75rem', fontWeight:700, color:'#9A7050', display:'block', marginBottom:'3px'}}>IDADE (ANOS)</label>
                    <input type="number" placeholder="0" value={petAge} onChange={e => setPetAge(e.target.value)} min="0"
                      style={{width:'100%', boxSizing:'border-box', padding:'11px 14px', borderRadius:'12px', border:'2px solid transparent', fontSize:'0.85rem', fontFamily:'inherit', outline:'none', background:'#FEF3C7', transition:'border 0.15s'}}
                      onFocus={e => e.target.style.borderColor = '#F97316'}
                      onBlur={e => e.target.style.borderColor = 'transparent'} />
                  </div>
                  <div>
                    <label style={{fontSize:'0.75rem', fontWeight:700, color:'#9A7050', display:'block', marginBottom:'3px'}}>PESO (KG)</label>
                    <input type="number" placeholder="0.0" value={petWeight} onChange={e => setPetWeight(e.target.value)} min="0" step="0.1"
                      style={{width:'100%', boxSizing:'border-box', padding:'11px 14px', borderRadius:'12px', border:'2px solid transparent', fontSize:'0.85rem', fontFamily:'inherit', outline:'none', background:'#FEF3C7', transition:'border 0.15s'}}
                      onFocus={e => e.target.style.borderColor = '#F97316'}
                      onBlur={e => e.target.style.borderColor = 'transparent'} />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'4px'}}>
              <button type="button" onClick={() => setShowPetForm(false)}
                style={{background:'#FEF3C7', color:'#9A7050', border:'none', borderRadius:'30px', padding:'12px', fontWeight:800, fontSize:'0.85rem', cursor:'pointer', transition:'all 0.15s'}}>
                Cancelar
              </button>
              <button type="submit"
                style={{background:'#F97316', color:'white', border:'none', borderRadius:'30px', padding:'12px', fontWeight:800, fontSize:'0.85rem', cursor:'pointer', transition:'all 0.15s'}}>
                + Cadastrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  if (isMobile) {
    const activeTab = mobileNav.findIndex(n => {
      if (n.path === '/app') return location.pathname === '/app';
      return location.pathname.startsWith(n.path);
    });

    return (
      <div style={{maxWidth:'480px', margin:'0 auto', fontFamily:"'Nunito', sans-serif"}}>
        <div style={{background:'#F97316', borderRadius:'0 0 28px 28px', padding:'12px 20px 24px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
            <span style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.8rem', color:'white'}}>🐾 Patalerta</span>
            <span style={{fontSize:'0.7rem', fontWeight:700, color:'white', cursor:'pointer'}} onClick={handleLogout}>
              Sair
            </span>
          </div>
          {selectedPet && (
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginTop:'10px'}}>
              <div style={{width:'44px', height:'44px', background:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', border:'3px solid rgba(255,255,255,0.5)'}}>{selectedPet?.emoji || '🐕'}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Fredoka One', cursive", color:'white', fontSize:'1rem'}}>{selectedPet.name}</div>
                <div style={{fontSize:'0.7rem', color:'rgba(255,255,255,0.75)'}}>{selectedPet.breed || ''} • {selectedPet.age || 0} anos</div>
              </div>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <span onClick={() => setShowPetForm(true)} style={{background:'rgba(255,255,255,0.25)', borderRadius:'50%', width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'white', cursor:'pointer', fontWeight:700}}>+</span>
                <div style={{background:'rgba(255,255,255,0.2)', borderRadius:'10px', padding:'4px 10px', textAlign:'center'}}>
                  <div style={{fontFamily:"'Fredoka One', cursive", fontSize:'1rem', color:'white'}}>{healthScore}%</div>
                  <span style={{fontSize:'0.55rem', color:'rgba(255,255,255,0.8)'}}>Saúde</span>
                </div>
              </div>
            </div>
          )}
          {pets.length > 1 && (
            <div style={{display:'flex', gap:'6px', marginTop:'8px', overflowX:'auto'}}>
              {pets.map(p => (
                <span key={p.id} onClick={() => setSelectedPet(p)}
                  style={{fontSize:'0.65rem', fontWeight:700, padding:'3px 10px', borderRadius:'20px', cursor:'pointer', whiteSpace:'nowrap',
                    background: selectedPet?.id === p.id ? 'white' : 'rgba(255,255,255,0.25)',
                    color: selectedPet?.id === p.id ? '#F97316' : 'white'}}>
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{padding:'16px 16px 100px'}}>
          <Outlet />
        </div>

        <PetFormModal />

        <div style={{position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:'480px', background:'white', borderTop:'1px solid #FDE8D0', display:'flex', padding:'10px 0 20px'}}>
          {mobileNav.map((n, i) => {
            const isActive = i === activeTab;
            return (
              <div key={i} onClick={() => navigate(n.path)}
                style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', cursor:'pointer', padding:'4px 0'}}>
                <span style={{fontSize:'1.3rem', ...(isActive ? {background:'#FED7AA', borderRadius:'12px', padding:'4px 10px'} : {})}}>{n.icon}</span>
                <span style={{fontSize:'0.58rem', fontWeight:700, color: isActive ? '#F97316' : '#C4A882'}}>{n.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ===================== WEB LAYOUT ===================== */
  return (
    <div>
      <nav className="navbar">
        <a href="/" className="nav-logo">🐾 Patalerta</a>
        <ul className="nav-links">
          <li><span onClick={handleLogout} style={{cursor:'pointer'}}>Sair</span></li>
          <li><span className="nav-cta" style={{cursor:'default'}}>{user?.name || 'Dashboard'}</span></li>
        </ul>
      </nav>

      <div style={{maxWidth:WEB_MAX_WIDTH + 'px', margin:'80px auto 0', padding:'0 20px', width:'100%'}}>
        <div style={{background:'linear-gradient(135deg, #FFF7ED, #FFEDD5)', borderRadius:'16px', padding:'14px 20px', marginBottom:'20px', border:'1px solid #FED7AA', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', flexWrap:'wrap'}}>
          <div style={{fontSize:'0.8rem', fontWeight:700, color:'#92400E'}}>
            📱 Funcionalidades completas no <strong>app Patalerta para celular</strong> — vacinas, ração, passeios, veterinário e mais!
          </div>
          <span style={{background:'#F97316', color:'white', padding:'8px 20px', borderRadius:'30px', fontWeight:800, fontSize:'0.75rem', whiteSpace:'nowrap', display:'inline-block'}}>
            Baixar App
          </span>
        </div>
      </div>

      <div style={{maxWidth:WEB_MAX_WIDTH + 'px', margin:'0 auto 40px', padding:'0 20px', width:'100%'}}>
        <div className="dash-body" style={{gridTemplateColumns:'280px 1fr'}}>
          <div className="dash-sidebar">
            {selectedPet && (
              <div className="dash-pet-card" style={{border:'2px solid #F97316'}}>
                <div className="dash-pet-emoji">{selectedPet?.emoji || '🐕'}</div>
                <div className="health-ring"><span>{healthScore}%</span></div>
                <div className="dash-pet-name">{selectedPet.name}</div>
                <div className="dash-pet-breed">{selectedPet.breed || ''} • {selectedPet.age || 0} anos</div>
              </div>
            )}
            {pets.length > 1 && pets.filter(p => p.id !== selectedPet?.id).map(p => (
              <div key={p.id} className="dash-pet-card" onClick={() => setSelectedPet(p)} style={{cursor:'pointer'}}>
                <div className="dash-pet-emoji">{p.emoji || '🐕'}</div>
                <div className="health-ring"><span>-%</span></div>
                <div className="dash-pet-name">{p.name}</div>
                <div className="dash-pet-breed">{p.breed || ''} • {p.age || 0} anos</div>
              </div>
            ))}
            <div onClick={() => setShowPetForm(true)} style={{background:'#F97316', color:'white', borderRadius:'12px', padding:'10px', textAlign:'center', fontWeight:800, fontSize:'0.8rem', cursor:'pointer', marginBottom:'4px'}}>
              + Novo Pet
            </div>
            <ul className="sidebar-menu" style={{marginTop:'16px'}}>
              {navItems.map(item => {
                const isActive = item.path === '/app'
                  ? location.pathname === '/app'
                  : location.pathname.startsWith(item.path);
                return (
                  <li key={item.path} className={isActive ? 'active' : ''} onClick={() => navigate(item.path)} style={{cursor:'pointer'}}>
                    <span>{item.icon}</span> {item.label}
                  </li>
                );
              })}
              <li onClick={() => navigate('/app/alerts')} style={{cursor:'pointer'}}
                className={location.pathname === '/app/alerts' ? 'active' : ''}>
                <span>🔔</span> Alertas
              </li>
              <li onClick={() => navigate('/app/schedule')} style={{cursor:'pointer'}}
                className={location.pathname === '/app/schedule' ? 'active' : ''}>
                <span>📅</span> Agenda
              </li>
              <li onClick={() => navigate('/app/profile')} style={{cursor:'pointer'}}
                className={location.pathname === '/app/profile' ? 'active' : ''}>
                <span>👤</span> Perfil
              </li>
            </ul>
          </div>
          <div className="dash-main">
            <Outlet />
          </div>
        </div>
      </div>

      <PetFormModal />
    </div>
  );
}
