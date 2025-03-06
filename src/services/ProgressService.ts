// Estructura de datos del progreso del usuario
interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  diamonds: number;
}

// Constantes para los cálculos de nivel
const BASE_XP_TO_LEVEL = 100;
const XP_MULTIPLIER = 1.5;
const STORAGE_KEY = 'kellogsUserProgress';

// Función para cargar el progreso del usuario desde localStorage
export const loadUserProgress = (): UserProgress => {
  const savedProgress = localStorage.getItem(STORAGE_KEY);
  
  if (savedProgress) {
    return JSON.parse(savedProgress);
  }
  
  // Valores iniciales si no hay datos guardados
  return {
    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP_TO_LEVEL,
    coins: 0,
    diamonds: 0
  };
};

// Exportar loadUserProgress también como getUserProgress para mejor semántica
export const getUserProgress = loadUserProgress;

// Función para guardar el progreso del usuario en localStorage
export const saveUserProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

// Función para calcular la XP necesaria para el siguiente nivel
export const calculateXpForLevel = (level: number): number => {
  return Math.floor(BASE_XP_TO_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
};

// Función para añadir XP y gestionar subidas de nivel
export const addXp = (amount: number): UserProgress => {
  const progress = loadUserProgress();
  progress.xp += amount;
  
  // Comprobar si sube de nivel
  while (progress.xp >= progress.xpToNextLevel) {
    progress.xp -= progress.xpToNextLevel;
    progress.level += 1;
    progress.xpToNextLevel = calculateXpForLevel(progress.level);
  }
  
  saveUserProgress(progress);
  return progress;
};

// Función para añadir monedas
export const addCoins = (amount: number): UserProgress => {
  const progress = loadUserProgress();
  progress.coins += amount;
  saveUserProgress(progress);
  return progress;
};

// Función para añadir diamantes
export const addDiamonds = (amount: number): UserProgress => {
  const progress = loadUserProgress();
  progress.diamonds += amount;
  saveUserProgress(progress);
  return progress;
};

// Función para resetear el progreso (para pruebas)
export const resetProgress = (): UserProgress => {
  const initialProgress = {
    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP_TO_LEVEL,
    coins: 0,
    diamonds: 0
  };
  
  saveUserProgress(initialProgress);
  return initialProgress;
};

// Exportar el tipo para que otros componentes puedan utilizarlo
export type { UserProgress }; 