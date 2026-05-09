import React, { useEffect, useState } from 'react';
import { usePet } from '../contexts/PetContext';
import api from '../services/api';

export default function Vaccines() {
  const { selectedPet } = usePet();
  const [vaccines, setVaccines] = useState([]);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!selectedPet) return;
    api.get(`/vaccines/pet/${selectedPet.id}`).then(r => setVaccines(r.data)).catch(() => setError('Erro ao carregar vacinas'));
  }, [selectedPet]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !applicationDate || !expirationDate) return;
    api.post(`/vaccines/pet/${selectedPet.id}`, { name, dose, applicationDate, expirationDate })
      .then(r => {
        setVaccines(prev => [...prev, r.data]);
        setName(''); setDose(''); setApplicationDate(''); setExpirationDate('');
        setSuccess('Vacina cadastrada!');
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(e => setError(e.response?.data?.message || 'Erro ao cadastrar'));
  };

  const handleDelete = (id) => {
    api.delete(`/vaccines/${id}`).then(() => {
      setVaccines(prev => prev.filter(v => v.id !== id));
    }).catch(() => setError('Erro ao deletar'));
  };

  const expiringSoon = vaccine => {
    if (!vaccine.expirationDate) return false;
    const days = (new Date(vaccine.expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 7 && days >= 0;
  };

  if (!selectedPet) {
    return <div style={{padding:20, textAlign:'center', color:'#9A7050'}}>Selecione um pet primeiro.</div>;
  }

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
        <span style={{fontSize:'1.4rem'}}>💉</span>
        <h2 style={{fontFamily:"'Fredoka One', cursive", fontSize:'1.3rem', color:'#3D2B1A', margin:0}}>Vacinas</h2>
      </div>

      {error && <div style={{background:'#FEF2F2', borderRadius:'10px', padding:'8px 12px', fontSize:'0.75rem', color:'#991B1B', marginBottom:'12px'}}>{error}</div>}
      {success && <div style={{background:'#F0FDF4', borderRadius:'10px', padding:'8px 12px', fontSize:'0.75rem', color:'#065F46', marginBottom:'12px'}}>{success}</div>}

      {/* Add form */}
      <div style={{background:'white', borderRadius:'16px', padding:'16px', marginBottom:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
        <div style={{fontWeight:700, fontSize:'0.85rem', color:'#6B4226', marginBottom:'12px'}}>Nova vacina</div>
        <form onSubmit={handleAdd}>
          <div style={{display:'grid', gap:'10px'}}>
            <input placeholder="Nome da vacina (ex: V10)" value={name} onChange={e => setName(e.target.value)}
              style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
            <input placeholder="Dose (ex: 1ª dose)" value={dose} onChange={e => setDose(e.target.value)}
              style={{padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
              <div>
                <div style={{fontSize:'0.65rem', fontWeight:700, color:'#9A7050', marginBottom:'3px'}}>Aplicação</div>
                <input type="date" value={applicationDate} onChange={e => setApplicationDate(e.target.value)}
                  style={{width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
              </div>
              <div>
                <div style={{fontSize:'0.65rem', fontWeight:700, color:'#9A7050', marginBottom:'3px'}}>Vencimento</div>
                <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)}
                  style={{width:'100%', padding:'10px 12px', borderRadius:'10px', border:'2px solid #FFE4C4', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', background:'#FFF7ED'}} />
              </div>
            </div>
            <button type="submit" style={{background:'#F97316', color:'white', border:'none', borderRadius:'30px', padding:'10px', fontWeight:800, fontSize:'0.85rem', cursor:'pointer'}}>
              + Cadastrar Vacina
            </button>
          </div>
        </form>
      </div>

      {/* Vaccine list */}
      {vaccines.length === 0 ? (
        <div style={{background:'white', borderRadius:'16px', padding:'24px', textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
          <span style={{fontSize:'2rem', display:'block', marginBottom:'8px'}}>💉</span>
          <div style={{fontSize:'0.85rem', color:'#9A7050', fontWeight:600}}>Nenhuma vacina cadastrada.</div>
          <div style={{fontSize:'0.7rem', color:'#C4A882', marginTop:'4px'}}>Adicione a primeira vacina do {selectedPet.name}!</div>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          {vaccines.map(v => {
            const expiring = expiringSoon(v);
            return (
              <div key={v.id} style={{background:'white', borderRadius:'14px', padding:'12px 14px', display:'flex', gap:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', borderLeft: expiring ? '4px solid #F59E0B' : '4px solid #22C55E'}}>
                <div style={{width:'38px', height:'38px', borderRadius:'10px', background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0}}>💉</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700, fontSize:'0.85rem', color:'#3D2B1A'}}>
                    {v.name} {v.dose && <span style={{fontWeight:400, color:'#9A7050'}}>({v.dose})</span>}
                  </div>
                  <div style={{display:'flex', gap:'12px', marginTop:'3px', fontSize:'0.7rem', color:'#9A7050'}}>
                    <span>Aplic: {new Date(v.applicationDate).toLocaleDateString('pt-BR')}</span>
                    <span>Vence: {new Date(v.expirationDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {expiring && (
                    <div style={{marginTop:'4px', fontSize:'0.65rem', fontWeight:700, color:'#92400E', background:'#FEF3C7', padding:'2px 8px', borderRadius:'8px', display:'inline-block'}}>
                      ⚠️ Vence em breve!
                    </div>
                  )}
                </div>
                <div onClick={() => handleDelete(v.id)} style={{cursor:'pointer', fontSize:'0.85rem', color:'#EF4444', alignSelf:'center', padding:'4px'}} title="Remover">
                  ✕
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
