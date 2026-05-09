import React, { useEffect, useState } from 'react';
import { usePet } from '../contexts/PetContext';
import api from '../services/api';

export default function Alerts() {
  const { selectedPet } = usePet();
  const [vaccines, setVaccines] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!selectedPet) return;
    api.get(`/vaccines/pet/${selectedPet.id}`).then(r => setVaccines(r.data)).catch(() => {});
    api.get(`/activities/pet/${selectedPet.id}`).then(r => {
      setActivities(r.data.filter(a => !a.completed));
    }).catch(() => {});
  }, [selectedPet]);

  const expiringVaccines = vaccines.filter(v => {
    if (!v.expirationDate) return false;
    const days = (new Date(v.expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 7 && days >= 1;
  });

  const overdueVaccines = vaccines.filter(v => {
    if (!v.expirationDate) return false;
    return new Date(v.expirationDate) < new Date();
  });

  const today = new Date().toDateString();
  const pendingToday = activities.filter(a =>
    new Date(a.scheduledTime).toDateString() === today
  );

  const overdueActivities = activities.filter(a =>
    new Date(a.scheduledTime) < new Date() &&
    new Date(a.scheduledTime).toDateString() !== today
  );

  if (!selectedPet) {
    return <div style={{padding:20, textAlign:'center', color:'#9A7050'}}>Selecione um pet primeiro.</div>;
  }

  const totalAlerts = expiringVaccines.length + overdueVaccines.length + pendingToday.length + overdueActivities.length;

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
        <span style={{fontSize:'1.4rem'}}>🔔</span>
        <h2 style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.3rem', color:'#3D2B1A', margin:0}}>Alertas</h2>
        {totalAlerts > 0 && (
          <span style={{background:'#EF4444', color:'white', borderRadius:'50%', width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:800}}>
            {totalAlerts}
          </span>
        )}
      </div>


      {totalAlerts === 0 && (
        <div style={{background:'white', borderRadius:'16px', padding:'24px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
          <span style={{fontSize:'2.5rem', display:'block', marginBottom:'8px'}}>✅</span>
          <div style={{fontSize:'0.85rem', color:'#9A7050', fontWeight:600}}>Tudo em ordem com {selectedPet.name}!</div>
          <div style={{fontSize:'0.7rem', color:'#C4A882', marginTop:'4px'}}>Nenhum alerta no momento.</div>
        </div>
      )}

      {/* Expiring vaccines */}
      {expiringVaccines.length > 0 && (
        <div style={{marginBottom:'14px'}}>
          <div style={{fontWeight:700, fontSize:'0.8rem', color:'#92400E', marginBottom:'6px'}}>⚠️ Vacinas próximas do vencimento</div>
          {expiringVaccines.map(v => (
            <div key={v.id} style={{background:'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius:'14px', padding:'12px 14px', marginBottom:'6px', borderLeft:'4px solid #F59E0B'}}>
              <div style={{fontWeight:700, fontSize:'0.85rem', color:'#78350F'}}>💉 {v.name}</div>
              <div style={{fontSize:'0.7rem', color:'#B45309', marginTop:'2px'}}>
                Vence em {Math.ceil((new Date(v.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))} dias ({new Date(v.expirationDate).toLocaleDateString('pt-BR')})
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overdue vaccines */}
      {overdueVaccines.length > 0 && (
        <div style={{marginBottom:'14px'}}>
          <div style={{fontWeight:700, fontSize:'0.8rem', color:'#991B1B', marginBottom:'6px'}}>🚨 Vacinas vencidas</div>
          {overdueVaccines.map(v => (
            <div key={v.id} style={{background:'#FEF2F2', borderRadius:'14px', padding:'12px 14px', marginBottom:'6px', borderLeft:'4px solid #EF4444'}}>
              <div style={{fontWeight:700, fontSize:'0.85rem', color:'#991B1B'}}>💉 {v.name}</div>
              <div style={{fontSize:'0.7rem', color:'#B91C1C', marginTop:'2px'}}>
                Venceu em {new Date(v.expirationDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending today */}
      {pendingToday.length > 0 && (
        <div style={{marginBottom:'14px'}}>
          <div style={{fontWeight:700, fontSize:'0.8rem', color:'#6B4226', marginBottom:'6px'}}>⏳ Atividades pendentes hoje</div>
          {pendingToday.map(a => (
            <div key={a.id} style={{background:'white', borderRadius:'12px', padding:'10px 12px', marginBottom:'6px', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', display:'flex', gap:'10px'}}>
              <div style={{fontSize:'1.1rem'}}>{a.type === 'FOOD' ? '🍖' : a.type === 'WALK' ? '🚶' : a.type === 'MEDICATION' ? '💊' : a.type === 'VET' ? '🏥' : '📋'}</div>
              <div>
                <div style={{fontWeight:700, fontSize:'0.8rem', color:'#3D2B1A'}}>{a.description || a.type}</div>
                <div style={{fontSize:'0.65rem', color:'#9A7050'}}>{new Date(a.scheduledTime).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overdue activities */}
      {overdueActivities.length > 0 && (
        <div style={{marginBottom:'14px'}}>
          <div style={{fontWeight:700, fontSize:'0.8rem', color:'#991B1B', marginBottom:'6px'}}>🚨 Atividades atrasadas</div>
          {overdueActivities.map(a => (
            <div key={a.id} style={{background:'#FEF2F2', borderRadius:'12px', padding:'10px 12px', marginBottom:'6px', borderLeft:'4px solid #EF4444', display:'flex', gap:'10px'}}>
              <div style={{fontSize:'1.1rem'}}>{a.type === 'FOOD' ? '🍖' : a.type === 'WALK' ? '🚶' : a.type === 'MEDICATION' ? '💊' : a.type === 'VET' ? '🏥' : '📋'}</div>
              <div>
                <div style={{fontWeight:700, fontSize:'0.8rem', color:'#991B1B'}}>{a.description || a.type}</div>
                <div style={{fontSize:'0.65rem', color:'#B91C1C'}}>
                  {new Date(a.scheduledTime).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
