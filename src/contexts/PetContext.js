import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const PetContext = createContext();

export function PetProvider({ children }) {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get('/pets').then(r => {
      const list = r.data;
      setPets(list);
      if (list.length > 0) {
        setSelectedPet(prev => {
          if (prev) {
            const stillExists = list.find(p => p.id === prev.id);
            return stillExists ? prev : list[0];
          }
          return list[0];
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  return (
    <PetContext.Provider value={{ pets, setPets, selectedPet, setSelectedPet, loading }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  return useContext(PetContext);
}
