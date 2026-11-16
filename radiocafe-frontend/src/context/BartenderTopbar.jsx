import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function BartenderTopbar({ totalActivos = 0 }) {
  const { logout } = useAuth() || {};
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    if (logout) logout();
    navigate('/');
  };

  return (
    <header
      style={{
        background: '#d95d1e',
        color: '#fff',
        padding: '0.9rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            background: '#1a1a1a',
            color: '#f5b041',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.8rem',
          }}
        >
          RC
        </span>
        <strong style={{ fontSize: '1.15rem', letterSpacing: '0.5px' }}>
          RADIOCAFÉ · ESTACIÓN BARTENDER
        </strong>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span
          style={{
            background: 'rgba(255,255,255,0.18)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.88rem',
          }}
        >
          En cola: <strong>{totalActivos}</strong>
        </span>

        <button
          onClick={handleCerrarSesion}
          style={{
            background: 'rgba(255,255,255,0.18)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.35)',
            padding: '7px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem',
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}