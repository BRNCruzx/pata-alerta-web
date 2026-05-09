import React, { useEffect, useState } from 'react';
import { usePet } from '../contexts/PetContext';
import api from '../services/api';

const typeConfig = {
  FOOD: { icon: '🍖', bg: '#F0FDF4' },
  WALK: { icon: '🚶', bg: '#EFF6FF' },
  WATER: { icon: '💧', bg: '#E0F2FE' },
  MEDICATION: { icon: '💊', bg: '#F5F3FF' },
  VET: { icon: '🏥', bg: '#FFF1F2' },
  VACCINE: { icon: '💉', bg: '#F5F3FF' },
};

export default function Schedule() {
  const { selectedPet } = usePet();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedPet) return;
    api.get(`/activities/pet/${selectedPet.id}`).then(r => setActivities(r.data)).catch(() => setError('Erro ao carregar'));
  }, [selectedPet]);

  const filtered = filter === 'all' ? activities : activities.filter(a => {
    if (filter === 'today') {
      const today = new Date().toDateString();
      return new Date(a.scheduledTime).toDateString() === today;
    }
    if (filter === 'pending') return !a.completed;
    if (filter === 'done') return a.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

  if (!selectedPet) {
    return <div style={{padding:20, textAlign:'center', color:'#9A7050'}}>Selecione um pet primeiro.</div>;
  }

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
        <span style={{fontSize:'1.4rem'}}>📅</span>
        <h2 style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.3rem', color:'#3D2B1A', margin:0}}>Agenda</h2>
      </div>

      {error && <div style={{background:'#FEF2F2', borderRadius:'10px', padding:'8px 12px', fontSize:'0.75rem', color:'#991B1B', marginBottom:'12px'}}>{error}</div>}

      {/* Filters */}
      <div style={{display:'flex', gap:'6px', marginBottom:'14px', flexWrap:'wrap'}}>
        {[
          { key: 'all', label: 'Todas' },
          { key: 'today', label: 'Hoje' },
          { key: 'pending', label: 'Pendentes' },
          { key: 'done', label: 'Concluídas' },
        ].map(f => (
          <span key={f.key} onClick={() => setFilter(f.key)}
            style={{fontSize:'0.7rem', fontWeight:700, padding:'5px 14px', borderRadius:'20px', cursor:'pointer',
              background: filter === f.key ? '#F97316' : '#FFF7ED',
              color: filter === f.key ? 'white' : '#9A7050'}}>
            {f.label}
          </span>
        ))}
      </div>

      {/* Group by date */}
      {sorted.length === 0 ? (
        <div style={{background:'white', borderRadius:'16px', padding:'24px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
          <span style={{fontSize:'2rem', display:'block', marginBottom:'8px'}}>📅</span>
          <div style={{fontSize:'0.85rem', color:'#9A7050', fontWeight:600}}>Nenhuma atividade encontrada.</div>
        </div>
      ) : (
        (() => {
          const groups = {};
          sorted.forEach(a => {
            const dateKey = new Date(a.scheduledTime).toLocaleDateString('pt-BR');
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(a);
          });
          return Object.entries(groups).map(([date, items]) => (
            <div key={date} style={{marginBottom:'14px'}}>
              <div style={{fontWeight:700, fontSize:'0.8rem', color:'#6B4226', marginBottom:'6px'}}>{date}</div>
              {items.map(a => {
                const cfg = typeConfig[a.type] || { icon: '📋', bg: '#F5F3FF' };
                return (
                  <div key={a.id} style={{background:'white', borderRadius:'12px', padding:'10px 12px', display:'flex', gap:'10px', marginBottom:'6px', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', opacity: a.completed ? 0.5 : 1}}>
                    <div style={{width:'34px', height:'34px', borderRadius:'8px', background: cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0}}>{cfg.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700, fontSize:'0.8rem', color:'#3D2B1A', textDecoration: a.completed ? 'line-through' : 'none'}}>
                        {a.description || a.type}
                      </div>
                      <div style={{fontSize:'0.65rem', color:'#9A7050', marginTop:'1px'}}>
                        {new Date(a.scheduledTime).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                        {a.completed && ' • ✓ Concluído'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ));
        })()
      )}
    </div>
  );
}
