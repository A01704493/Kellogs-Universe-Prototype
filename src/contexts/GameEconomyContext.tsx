import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces
interface GameEconomyData {
  level: number;
  xp: number;
  coins: number;
  kDiamonds: number;
}

interface GameEconomyContextType {
  economy: GameEconomyData;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addKDiamonds: (amount: number) => void;
  getXPForNextLevel: () => number;
  getXPPercentage: () => number;
}

// Clave para localStorage
const ECONOMY_STORAGE_KEY = 'kellogsUniverse_gameEconomy';

// Función para calcular el XP necesario para el siguiente nivel
const calculateXPForLevel = (level: number): number => {
  // Función exponencial: nivel 1 necesita 100 XP, nivel 2 necesita 200 XP, etc.
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Crear el contexto
const GameEconomyContext = createContext<GameEconomyContextType | null>(null);

// Proveedor del contexto
export const GameEconomyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado inicial
  const [economy, setEconomy] = useState<GameEconomyData>({
    level: 1,
    xp: 0,
    coins: 0,
    kDiamonds: 0
  });

  // Cargar datos desde localStorage al inicio
  useEffect(() => {
    const savedEconomy = localStorage.getItem(ECONOMY_STORAGE_KEY);
    if (savedEconomy) {
      try {
        setEconomy(JSON.parse(savedEconomy));
      } catch (error) {
        console.error('Error loading game economy data:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(ECONOMY_STORAGE_KEY, JSON.stringify(economy));
  }, [economy]);

  // Función para añadir XP y subir de nivel si corresponde
  const addXP = (amount: number) => {
    setEconomy(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      
      // Verificar si hay suficiente XP para subir de nivel
      let xpForNextLevel = calculateXPForLevel(newLevel);
      
      while (newXP >= xpForNextLevel) {
        newXP -= xpForNextLevel;
        newLevel++;
        xpForNextLevel = calculateXPForLevel(newLevel);
      }
      
      return {
        ...prev,
        level: newLevel,
        xp: newXP
      };
    });
  };

  // Función para añadir monedas
  const addCoins = (amount: number) => {
    setEconomy(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  // Función para añadir diamantes K
  const addKDiamonds = (amount: number) => {
    setEconomy(prev => ({
      ...prev,
      kDiamonds: prev.kDiamonds + amount
    }));
  };

  // Función para obtener el XP necesario para el siguiente nivel
  const getXPForNextLevel = () => {
    return calculateXPForLevel(economy.level);
  };

  // Función para obtener el porcentaje de XP del nivel actual
  const getXPPercentage = () => {
    const xpForNextLevel = calculateXPForLevel(economy.level);
    return Math.min(100, Math.floor((economy.xp / xpForNextLevel) * 100));
  };

  // Valores que proporciona el contexto
  const value = {
    economy,
    addXP,
    addCoins,
    addKDiamonds,
    getXPForNextLevel,
    getXPPercentage
  };

  return (
    <GameEconomyContext.Provider value={value}>
      {children}
    </GameEconomyContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useGameEconomy = (): GameEconomyContextType => {
  const context = useContext(GameEconomyContext);
  if (!context) {
    throw new Error('useGameEconomy must be used within a GameEconomyProvider');
  }
  return context;
}; 