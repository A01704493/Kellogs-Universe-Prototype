import { Reward } from '../types/progression';
import { gameIntegrator } from './GameIntegrator';

// Interfaz para definir un código válido y sus recompensas
export interface RedeemableCode {
  code: string;
  isActive: boolean;
  isOneTime: boolean;  // Si solo se puede canjear una vez
  reward: Reward;
  description: string;
  expirationDate?: number; // Timestamp para fecha de expiración opcional
}

/**
 * Servicio para gestionar los códigos de redención
 */
class CodesService {
  // Lista de códigos válidos y sus recompensas
  private codes: RedeemableCode[] = [
    {
      code: 'ZUCARITAS',
      isActive: true,
      isOneTime: true,
      reward: {
        diamonds: 15,
        xp: 30,
        description: 'Recompensa de Zucaritas'
      },
      description: 'Una gorra con las orejas de Tony el Tigre'
    },
    {
      code: 'CHOCOKRISPIS',
      isActive: true,
      isOneTime: true,
      reward: {
        diamonds: 12,
        xp: 35,
        description: 'Recompensa de Choco Krispis'
      },
      description: 'Un sombrero con forma de Melvin el elefante'
    },
    {
      code: 'FROOTLOOPS',
      isActive: true,
      isOneTime: true,
      reward: {
        diamonds: 20,
        xp: 20,
        description: 'Recompensa de Froot Loops'
      },
      description: 'Un collar colorido como Sam el tucán'
    },
    {
      code: 'KELLOGS2023',
      isActive: true,
      isOneTime: true,
      reward: {
        diamonds: 50,
        xp: 100,
        description: 'Recompensa Especial Kelloggs'
      },
      description: 'Una capa especial de edición limitada con el logo de Kelloggs'
    },
    {
      code: 'DIARIO',
      isActive: true,
      isOneTime: false, // Este código se puede usar una vez por día
      reward: {
        coins: 10,
        xp: 5,
        description: 'Recompensa diaria'
      },
      description: 'Recompensa por visitar nuestro sitio web'
    }
  ];

  private REDEEMED_CODES_KEY = 'kellogsRedeemedCodes';
  private DAILY_CODES_KEY = 'kellogs_daily_codes';

  /**
   * Valida si un código puede ser redimido
   */
  public validateCode(inputCode: string): { valid: boolean; message: string; code?: RedeemableCode } {
    // Normalizar el código a mayúsculas
    const normalizedCode = inputCode.trim().toUpperCase();
    
    // Buscar el código en la lista de códigos válidos
    const code = this.codes.find(c => c.code === normalizedCode);
    
    // Si el código no existe
    if (!code) {
      return { 
        valid: false, 
        message: 'Código inválido o expirado. Por favor, verifica e intenta de nuevo.' 
      };
    }
    
    // Si el código está desactivado
    if (!code.isActive) {
      return { 
        valid: false, 
        message: 'Este código ha sido desactivado.' 
      };
    }
    
    // Si el código tiene fecha de expiración y ya expiró
    if (code.expirationDate && Date.now() > code.expirationDate) {
      return { 
        valid: false, 
        message: 'Este código ha expirado.' 
      };
    }
    
    // Verificar si es un código de un solo uso y ya fue redimido
    if (code.isOneTime) {
      const redeemedCodes = this.getRedeemedCodes();
      if (redeemedCodes.includes(normalizedCode)) {
        return { 
          valid: false, 
          message: 'Este código ya ha sido canjeado anteriormente.' 
        };
      }
    } else {
      // Para códigos diarios, verificar si se usó hoy
      const dailyCodes = this.getDailyCodeUsage();
      const today = new Date().toDateString();
      
      if (dailyCodes[normalizedCode] === today) {
        return { 
          valid: false, 
          message: 'Este código ya fue utilizado hoy. Vuelve mañana.' 
        };
      }
    }
    
    // El código es válido
    return { 
      valid: true, 
      message: 'Código válido', 
      code 
    };
  }

  /**
   * Redimir un código y otorgar recompensas
   */
  public redeemCode(inputCode: string): { success: boolean; message: string; reward?: Reward } {
    const validation = this.validateCode(inputCode);
    
    if (!validation.valid || !validation.code) {
      return {
        success: false,
        message: validation.message
      };
    }
    
    const code = validation.code;
    const normalizedCode = inputCode.trim().toUpperCase();
    
    // Marcar el código como redimido
    if (code.isOneTime) {
      // Para códigos de un solo uso
      const redeemedCodes = this.getRedeemedCodes();
      redeemedCodes.push(normalizedCode);
      localStorage.setItem(this.REDEEMED_CODES_KEY, JSON.stringify(redeemedCodes));
    } else {
      // Para códigos diarios
      const dailyCodes = this.getDailyCodeUsage();
      dailyCodes[normalizedCode] = new Date().toDateString();
      localStorage.setItem(this.DAILY_CODES_KEY, JSON.stringify(dailyCodes));
    }
    
    // Integrar con el sistema de progresión para otorgar recompensas
    gameIntegrator.handleCodeRedemption(normalizedCode);
    
    return {
      success: true,
      message: '¡Código canjeado con éxito!',
      reward: code.reward
    };
  }

  /**
   * Obtener lista de códigos ya redimidos
   */
  private getRedeemedCodes(): string[] {
    const codesJson = localStorage.getItem(this.REDEEMED_CODES_KEY);
    return codesJson ? JSON.parse(codesJson) : [];
  }

  /**
   * Obtener uso de códigos diarios
   */
  private getDailyCodeUsage(): Record<string, string> {
    const dailyCodesJson = localStorage.getItem(this.DAILY_CODES_KEY);
    return dailyCodesJson ? JSON.parse(dailyCodesJson) : {};
  }
}

// Exportar una instancia única del servicio
export const codesService = new CodesService();

// También exportamos la clase para casos donde se necesite una instancia personalizada
export default CodesService; 