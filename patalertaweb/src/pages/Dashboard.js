import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [activities, setActivities] = useState({});
  const [selectedPet, setSelectedPet] = useState(null);
  const [health, setHealth] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    api.get('/pets').then(r => {
      const list = r.data;
      setPets(list);
      if (list.length > 0) {
        setSelectedPet(list[0]);
      }
    }).catch(e => setError('Erro ao carregar pets'));
  }, [user]);

  useEffect(() => {
    if (!selectedPet) return;
    const pid = selectedPet.id;
    api.get(`/activities/pet/${pid}/today`).then(r => setActivities(prev => ({ ...prev, [pid]: r.data }))).catch(() => {});
    api.get(`/activities/pet/${pid}/health`).then(r => setHealth(r.data)).catch(() => {});
    api.get(`/vaccines/pet/${pid}`).then(r => setVaccines(r.data)).catch(() => {});
  }, [selectedPet]);

  const todayActs = selectedPet ? (activities[selectedPet.id] || []) : [];
  const doneCount = todayActs.filter(a => a.completed).length;
  const healthScore = health ? health.healthScore : 0;

  const expiringVaccine = vaccines.find(v => {
    if (!v.expirationDate) return false;
    const days = (new Date(v.expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 7 && days >= 0;
  });

  return (
    <div style={{maxWidth:'480px', margin:'0 auto', padding:'20px 16px 100px', fontFamily:"'Nunito', sans-serif"}}>
      {/* Header */}
      <div style={{background:'#F97316', borderRadius:'0 0 28px 28px', padding:'12px 20px 24px', margin:'-20px -16px 20px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
          <span style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.8rem', color:'white'}}>🐾 PataAlerta</span>
          <span style={{fontSize:'0.7rem', fontWeight:700, color:'white', cursor:'pointer'}} onClick={() => { logout(); navigate('/'); }}>
            Sair
          </span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginTop:'14px'}}>
          <div style={{width:'52px', height:'52px', background:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', border:'3px solid rgba(255,255,255,0.5)'}}>
            {selectedPet ? '🐕' : '🐾'}
          </div>
          <div>
            <div style={{fontFamily:"'Fredoka One', cursive", color:'white', fontSize:'1.1rem'}}>
              {selectedPet ? selectedPet.name : user?.name || 'Sem pets'}
            </div>
            <div style={{fontSize:'0.72rem', color:'rgba(255,255,255,0.75)'}}>
              {selectedPet ? `${selectedPet.breed || ''} • ${selectedPet.age || 0} anos` : 'Adicione um pet!'}
            </div>
          </div>
          <div style={{marginLeft:'auto', background:'rgba(255,255,255,0.2)', borderRadius:'12px', padding:'6px 12px', textAlign:'center'}}>
            <div style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.2rem', color:'white'}}>{healthScore}%</div>
            <span style={{fontSize:'0.6rem', color:'rgba(255,255,255,0.8)'}}>Saúde</span>
          </div>
        </div>
        {pets.length > 1 && (
          <div style={{display:'flex', gap:'6px', marginTop:'10px'}}>
            {pets.map(p => (
              <span key={p.id} onClick={() => setSelectedPet(p)}
                style={{fontSize:'0.65rem', fontWeight:700, padding:'3px 10px', borderRadius:'20px', cursor:'pointer',
                  background: selectedPet?.id === p.id ? 'white' : 'rgba(255,255,255,0.25)',
                  color: selectedPet?.id === p.id ? '#F97316' : 'white'}}>
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <div style={{background:'#FEF2F2', borderRadius:'12px', padding:'10px', fontSize:'0.75rem', color:'#991B1B', marginBottom:'14px'}}>{error}</div>}

      {/* Alert for expiring vaccine */}
      {expiringVaccine && (
        <div style={{background:'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius:'18px', padding:'14px', marginBottom:'14px', borderLeft:'4px solid #F59E0B'}}>
          <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'0.75rem', fontWeight:700, color:'#92400E', marginBottom:'6px'}}>⚠️ ALERTA</div>
          <div style={{fontFamily:"'Fredoka One', cursive", fontSize:'1rem', color:'#78350F'}}>
            💉 {expiringVaccine.name} — Vence em breve!
          </div>
          <div style={{fontSize:'0.7rem', color:'#B45309', marginTop:'2px'}}>
            Vencimento: {new Date(expiringVaccine.expirationDate).toLocaleDateString('pt-BR')}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{fontFamily:"'Fredoka One', cursive", fontSize:'1rem', color:'#92400E', margin:'8px 0 10px'}}>
        Acesso rápido
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'8px', marginBottom:'16px'}}>
        {[
          { icon: '💉', label: 'Vacinas' },
          { icon: '🍖', label: 'Ração' },
          { icon: '🚶', label: 'Passeio' },
          { icon: '🏥', label: 'Vet' },
        ].map((btn, i) => (
          <div key={i} style={{background:'white', borderRadius:'16px', padding:'12px 6px', textAlign:'center', boxShadow:'0 4px 20px rgba(249,115,22,0.12)', cursor:'pointer'}}>
            <span style={{fontSize:'1.5rem', display:'block', marginBottom:'4px'}}>{btn.icon}</span>
            <span style={{fontSize:'0.6rem', fontWeight:700, color:'#6B4226'}}>{btn.label}</span>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div style={{fontFamily:"'Fredoka One', cursive", fontSize:'1rem', color:'#92400E', margin:'8px 0 10px'}}>
        Rotina de hoje {todayActs.length > 0 && <span style={{fontSize:'0.7rem', color:'#9A7050'}}>({doneCount}/{todayActs.length})</span>}
      </div>
      {todayActs.length === 0 ? (
        <div style={{background:'white', borderRadius:'16px', padding:'20px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
          <span style={{fontSize:'2rem', display:'block', marginBottom:'8px'}}>🎉</span>
          <div style={{fontSize:'0.85rem', color:'#9A7050', fontWeight:600}}>Nenhuma atividade hoje!</div>
        </div>
      ) : todayActs.map((act, i) => (
        <div key={act.id || i} style={{background:'white', borderRadius:'16px', padding:'12px 14px', display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', opacity: act.completed ? 0.6 : 1}}>
          <div style={{width:'40px', height:'40px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0, background: act.type === 'FOOD' ? '#F0FDF4' : act.type === 'WALK' ? '#EFF6FF' : '#F5F3FF'}}>
            {act.type === 'FOOD' ? '🍖' : act.type === 'WALK' ? '🚶' : act.type === 'MEDICATION' ? '💊' : '📋'}
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700, fontSize:'0.85rem', color:'#3D2B1A', textDecoration: act.completed ? 'line-through' : 'none'}}>
              {act.description || act.type}
            </div>
            {act.scheduledTime && (
              <div style={{fontSize:'0.7rem', color:'#9A7050', marginTop:'1px'}}>
                {new Date(act.scheduledTime).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
              </div>
            )}
          </div>
          <div style={{width:'10px', height:'10px', borderRadius:'50%', flexShrink:0, background: act.completed ? '#22C55E' : '#E5E7EB', border: act.completed ? 'none' : '2px solid #D1D5DB'}} />
        </div>
      ))}

      {/* Bottom Nav */}
      <div style={{position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:'480px', background:'white', borderTop:'1px solid #FDE8D0', display:'flex', padding:'10px 0 20px'}}>
        {[
          { icon: '🏠', label: 'Início', active: true },
          { icon: '📅', label: 'Agenda', active: false },
          { icon: '🐾', label: 'Pets', active: false },
          { icon: '🔔', label: 'Alertas', active: false },
          { icon: '👤', label: 'Perfil', active: false },
        ].map((nav, i) => (
          <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', cursor:'pointer', padding:'4px 0'}}>
            <span style={{fontSize:'1.3rem', ...(nav.active ? {background:'#FED7AA', borderRadius:'12px', padding:'4px 10px'} : {})}}>{nav.icon}</span>
            <span style={{fontSize:'0.58rem', fontWeight:700, color: nav.active ? '#F97316' : '#C4A882'}}>{nav.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
