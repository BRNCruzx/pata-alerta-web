import React, { useEffect, useState } from 'react';
import { usePet } from '../contexts/PetContext';
import api from '../services/api';

export default function Food() {
  const { selectedPet } = usePet();
  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!selectedPet) return;
    api.get(`/activities/pet/${selectedPet.id}`).then(r => {
      setActivities(r.data.filter(a => a.type === 'FOOD'));
    }).catch(() => setError('Erro ao carregar'));
  }, [selectedPet]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!description || !scheduledTime) return;
    const points = 15;
    api.post(`/activities/pet/${selectedPet.id}`, { type: 'FOOD', description, scheduledTime, points })
      .then(r => {
        setActivities(prev => [...prev, r.data]);
        setDescription(''); setScheduledTime('');
        setSuccess('Alimentação cadastrada!');
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(e => setError(e.response?.data?.message || 'Erro ao cadastrar'));
  };

  const handleComplete = (id) => {
    api.patch(`/activities/${id}/complete`).then(r => {
      setActivities(prev => prev.map(a => a.id === id ? r.data : a));
    }).catch(() => setError('Erro ao completar'));
  };

  const handleDelete = (id) => {
    api.delete(`/activities/${id}`).then(() => {
      setActivities(prev => prev.filter(a => a.id !== id));
    }).catch(() => setError('Erro ao deletar'));
  };

  if (!selectedPet) {
    return <div style={{padding:20, textAlign:'center', color:'#9A7050'}}>Selecione um pet primeiro.</div>;
  }

  const today = new Date().toISOString().slice(0, 16);

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
        <span style={{fontSize:'1.4rem'}}>🍖</span>
        <h2 style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.3rem', color:'#3D2B1A', margin:0}}>Alimentação</h2>
      </div>

      {error && <div style={{background:'#FEF2F2', borderRadius:'10px', padding:'8px 12px', fontSize:'0.75rem', color:'#991B1B', marginBottom:'12px'}}>{error}</div>}
      {success && <div style={{background:'#F0FDF4', borderRadius:'10px', padding:'8px 12px', fontSize:'0.75rem', color:'#065F46', marginBottom:'12px'}}>{success}</div>}

      <div style={{background:'white', borderRadius:'16px', padding:'16px', marginBottom:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
        <div style={{fontWeight:700, fontSize:'0.85rem', color:'#6B4226', marginBottom:'12px'}}>Nova refeição</div>
        <form onSubmit={handleAdd}>
          <div style={{display:'grid', gap:'10px'}}>
            <input placeholder="Descrição (ex: Ração manhã 300g)" value={description} onChange={e => setDescription(e.target.value)}
              style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
            <input type="datetime-local" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} min={today}
              style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
            <button type="submit" style={{background:'#F97316', color:'white', border:'none', borderRadius:'30px', padding:'10px', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
              + Cadastrar Refeição
            </button>
          </div>
        </form>
      </div>

      {activities.length === 0 ? (
        <div style={{background:'white', borderRadius:'16px', padding:'24px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
          <span style={{fontSize:'2rem', display:'block', marginBottom:'8px'}}>🍖</span>
          <div style={{fontSize:'0.85rem', color:'#9A7050', fontWeight:600}}>Nenhuma refeição cadastrada.</div>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          {activities.map(a => (
            <div key={a.id} style={{background:'white', borderRadius:'14px', padding:'12px 14px', display:'flex', gap:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', opacity: a.completed ? 0.6 : 1}}>
              <div style={{width:'38px', height:'38px', borderRadius:'10px', background:'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0}}>🍖</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700, fontSize:'0.85rem', color:'#3D2B1A', textDecoration: a.completed ? 'line-through' : 'none'}}>
                  {a.description}
                </div>
                <div style={{fontSize:'0.7rem', color:'#9A7050', marginTop:'2px'}}>
                  {new Date(a.scheduledTime).toLocaleString('pt-BR')}
                </div>
              </div>
              <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
                {!a.completed && (
                  <span onClick={() => handleComplete(a.id)} style={{cursor:'pointer', fontSize:'0.7rem', background:'#22C55E', color:'white', padding:'4px 10px', borderRadius:'20px', fontWeight:700}}>✓</span>
                )}
                <span onClick={() => handleDelete(a.id)} style={{cursor:'pointer', fontSize:'0.85rem', color:'#EF4444', padding:'4px'}}>✕</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
