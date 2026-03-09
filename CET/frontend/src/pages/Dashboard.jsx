import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: `${color}18`, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: color, lineHeight: 1 }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const estadoConfig = {
  AGOTADO: { label: 'Agotado', badge: 'badge-red', icon: '🔴' },
  BAJO_STOCK: { label: 'Bajo Stock', badge: 'badge-yellow', icon: '🟡' },
  POR_VENCER: { label: 'Por Vencer', badge: 'badge-blue', icon: '🔵' },
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner spinner-dark"></div></div>;

  const s = data?.estadisticas || {};

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">👋 Hola, {usuario?.nombre?.split(' ')[0]}</h1>
          <p className="page-subtitle">Resumen del sistema CET — {new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/consultas')}>
          + Nueva Consulta
        </button>
      </div>

      {/* Stats principales */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard icon="👤" label="Pacientes Registrados" value={s.totalPacientes} color="var(--primary)" />
        <StatCard icon="📋" label="Consultas Hoy" value={s.consultasHoy} color="var(--accent)" sub={`${s.consultasMes} este mes`} />
        <StatCard icon="✅" label="Medicamentos Disponibles" value={s.medicamentosDisponibles} color="var(--success)" />
        <StatCard icon="⚠️" label="Alertas de Inventario" value={s.medicamentosAgotados + s.medicamentosBajoStock + s.medicamentosPorVencer} color="var(--warning)" />
      </div>

      <div className="grid-2">
        {/* Alertas */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>⚠️ Alertas de Medicamentos</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/medicamentos')}>Ver todos</button>
          </div>
          {data?.alertas?.length === 0 ? (
            <div className="empty-state"><p>✅ Sin alertas activas</p></div>
          ) : (
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {data?.alertas?.map(m => {
                const cfg = estadoConfig[m.estado] || {};
                return (
                  <div key={m._id} style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{m.nombre}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.cantidad} {m.unidad} disponibles</div>
                    </div>
                    <span className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Últimas consultas */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>📋 Últimas Consultas</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/consultas')}>Ver todas</button>
          </div>
          {data?.ultimasConsultas?.length === 0 ? (
            <div className="empty-state"><p>Sin consultas registradas</p></div>
          ) : (
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {data?.ultimasConsultas?.map(c => (
                <div key={c._id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                      {c.paciente?.nombre} {c.paciente?.apellido}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(c.fechaConsulta).toLocaleDateString('es-GT')}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {c.paciente?.grado} — {c.sintomas?.substring(0, 50)}{c.sintomas?.length > 50 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
