import React, { useState } from 'react';
import { codesService } from '../services';

/**
 * Componente para redimir códigos promocionales
 */
const RedeemCodeUI: React.FC = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error' | 'info'} | null>(null);
  const [reward, setReward] = useState<any>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setMessage({
        text: 'Por favor, ingresa un código',
        type: 'error'
      });
      return;
    }
    
    setIsRedeeming(true);
    setMessage({
      text: 'Verificando código...',
      type: 'info'
    });
    
    // Simular delay de red
    setTimeout(() => {
      const result = codesService.redeemCode(code);
      
      if (result.success) {
        setMessage({
          text: result.message,
          type: 'success'
        });
        setReward(result.reward);
      } else {
        setMessage({
          text: result.message,
          type: 'error'
        });
        setReward(null);
      }
      
      setIsRedeeming(false);
    }, 800);
  };

  return (
    <div className="redeem-code-ui">
      <h2>Canjear Código</h2>
      
      <form onSubmit={handleSubmit} className="code-form">
        <div className="input-group">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ingresa tu código aquí"
            disabled={isRedeeming}
            className="code-input"
          />
          <button 
            type="submit" 
            disabled={isRedeeming}
            className="submit-button"
          >
            {isRedeeming ? 'Canjeando...' : 'Canjear'}
          </button>
        </div>
        
        {message && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}
      </form>
      
      {reward && (
        <div className="reward-container">
          <h3>¡Recompensa obtenida!</h3>
          <div className="reward-details">
            {reward.diamonds > 0 && (
              <div className="reward-item">
                <span className="reward-icon">💎</span>
                <span className="reward-value">+{reward.diamonds} Diamantes</span>
              </div>
            )}
            {reward.xp > 0 && (
              <div className="reward-item">
                <span className="reward-icon">⭐</span>
                <span className="reward-value">+{reward.xp} XP</span>
              </div>
            )}
            {reward.coins > 0 && (
              <div className="reward-item">
                <span className="reward-icon">🪙</span>
                <span className="reward-value">+{reward.coins} Monedas</span>
              </div>
            )}
            {reward.description && (
              <div className="reward-description">
                {reward.description}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="codes-hint">
        <h3>Códigos disponibles para probar:</h3>
        <ul className="codes-list">
          <li><strong>ZUCARITAS</strong> - Recompensa de Zucaritas</li>
          <li><strong>CHOCOKRISPIS</strong> - Recompensa de Choco Krispis</li>
          <li><strong>FROOTLOOPS</strong> - Recompensa de Froot Loops</li>
          <li><strong>KELLOGS2023</strong> - Recompensa Especial Kelloggs</li>
          <li><strong>DIARIO</strong> - Recompensa diaria (se puede usar una vez por día)</li>
        </ul>
      </div>
      
      <style jsx>{`
        .redeem-code-ui {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        h2 {
          color: #333;
          margin-bottom: 20px;
        }
        
        .code-form {
          margin-bottom: 30px;
        }
        
        .input-group {
          display: flex;
          margin-bottom: 15px;
        }
        
        .code-input {
          flex: 1;
          padding: 12px 15px;
          font-size: 16px;
          border: 2px solid #ddd;
          border-radius: 4px 0 0 4px;
          outline: none;
          transition: border-color 0.3s;
        }
        
        .code-input:focus {
          border-color: #4a90e2;
        }
        
        .submit-button {
          padding: 12px 20px;
          background: #4a90e2;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .submit-button:hover:not(:disabled) {
          background: #3570b4;
        }
        
        .submit-button:disabled {
          background: #a0c0e4;
          cursor: not-allowed;
        }
        
        .message {
          padding: 12px 15px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .message-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .message-error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .message-info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        
        .reward-container {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          animation: fadeIn 0.5s;
        }
        
        .reward-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .reward-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .reward-icon {
          font-size: 24px;
        }
        
        .reward-value {
          font-size: 18px;
          font-weight: bold;
          color: #4a90e2;
        }
        
        .reward-description {
          margin-top: 10px;
          font-style: italic;
          color: #666;
        }
        
        .codes-hint {
          background: #f0f0f0;
          border-radius: 8px;
          padding: 20px;
        }
        
        .codes-list {
          padding-left: 20px;
        }
        
        .codes-list li {
          margin-bottom: 8px;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RedeemCodeUI; 