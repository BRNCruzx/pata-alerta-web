import React, { useEffect, useState } from 'react';
import { usePet } from '../contexts/PetContext';
import api from '../services/api';

export default function Dashboard() {
  const { selectedPet } = usePet();
  const [activities, setActivities] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  useEffect(() => {
    if (!selectedPet) return;
    const pid = selectedPet.id;
    api.get(`/activities/pet/${pid}/today`).then(r => setActivities(prev => ({ ...prev, [pid]: r.data }))).catch(() => {});
    api.get(`/vaccines/pet/${pid}`).then(r => setVaccines(r.data)).catch(() => {});
  }, [selectedPet]);

  const pid = selectedPet?.id;
  const todayActs = pid ? (activities[pid] || []) : [];
  const doneCount = todayActs.filter(a => a.completed).length;

  const expiringVaccine = vaccines.find(v => {
    if (!v.expirationDate) return false;
    const days = (new Date(v.expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 7 && days >= 0;
  });

  if (!selectedPet) {
    return (
      <div style={{textAlign:'center', padding:'40px 0'}}>
        <span style={{fontSize:'3rem', display:'block', marginBottom:'12px'}}>🐾</span>
        <div style={{fontSize:'1rem', color:'#9A7050', fontWeight:700}}>Bem-vindo ao Patalerta!</div>
        <div style={{fontSize:'0.8rem', color:'#C4A882', marginTop:'6px'}}>Adicione um pet no app mobile para começar.</div>
      </div>
    );
  }

  return (
    <div>
      {/* Health + greeting */}
      <div style={{marginBottom:'16px'}}>
        <div className="dash-greeting">
          Bom dia! Veja como está <strong>{selectedPet.name}</strong> 🐾
        </div>
      </div>

      {/* Cards */}
      <div className="dash-cards-row">
        {expiringVaccine ? (
          <div className="mini-card warn">
            <div className="mc-icon">💉</div>
            <div className="mc-label">Próxima Vacina</div>
            <div className="mc-value">
              {Math.ceil((new Date(expiringVaccine.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))} dias
            </div>
            <div className="mc-sub">
              {expiringVaccine.name} • Vence {new Date(expiringVaccine.expirationDate).toLocaleDateString('pt-BR')}
            </div>
          </div>
        ) : (
          <div className="mini-card">
            <div className="mc-icon">💉</div>
            <div className="mc-label">Vacinas</div>
            <div className="mc-value">{vaccines.length}</div>
            <div className="mc-sub">Todas em dia</div>
          </div>
        )}
        <div className="mini-card">
          <div className="mc-icon">🚶</div>
          <div className="mc-label">Atividades hoje</div>
          <div className="mc-value">{doneCount}/{todayActs.length}</div>
          <div className="mc-sub">
            {todayActs.length > 0 ? `${Math.round((doneCount / todayActs.length) * 100)}% concluído` : 'Nenhuma atividade'}
          </div>
        </div>
      </div>

      {/* Vaccine alert banner */}
      {expiringVaccine && (
        <div style={{background:'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius:'14px', padding:'12px 16px', marginBottom:'14px', borderLeft:'4px solid #F59E0B', display:'flex', alignItems:'center', gap:'10px'}}>
          <span style={{fontSize:'1.2rem'}}>⚠️</span>
          <div>
            <div style={{fontWeight:700, fontSize:'0.8rem', color:'#92400E'}}>
              💉 {expiringVaccine.name} — Vence em {Math.ceil((new Date(expiringVaccine.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))} dias
            </div>
            <div style={{fontSize:'0.7rem', color:'#B45309'}}>
              Vencimento: {new Date(expiringVaccine.expirationDate).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      )}

      {/* Today timeline */}
      <div className="timeline-title">📅 Rotina de hoje</div>
      {todayActs.length === 0 ? (
        <div style={{background:'white', borderRadius:'16px', padding:'24px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
          <span style={{fontSize:'2rem', display:'block', marginBottom:'8px'}}>🎉</span>
          <div style={{fontSize:'0.9rem', color:'#9A7050', fontWeight:600}}>Nenhuma atividade hoje!</div>
        </div>
      ) : todayActs.map((act, i) => (
        <div className="tl-item" key={act.id || i} style={{opacity: act.completed ? 0.6 : 1}}>
          <div className={`tl-dot ${act.type === 'FOOD' ? 'g' : act.type === 'WALK' ? 'b' : 'p'}`}>
            {act.type === 'FOOD' ? '🍖' : act.type === 'WALK' ? '🚶' : act.type === 'MEDICATION' ? '💊' : '📋'}
          </div>
          <div className="tl-info">
            <div className="tl-name" style={{textDecoration: act.completed ? 'line-through' : 'none'}}>
              {act.description || act.type}
            </div>
            {act.scheduledTime && (
              <div className="tl-detail">
                {new Date(act.scheduledTime).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
              </div>
            )}
          </div>
          <span className={`tl-badge ${act.completed ? 'done' : 'pending'}`}>
            {act.completed ? '✓ Feito' : '⏳ Pendente'}
          </span>
        </div>
      ))}
    </div>
  );
}
