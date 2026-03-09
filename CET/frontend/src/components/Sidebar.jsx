import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: '⊞', label: 'Dashboard', exact: true },
  { to: '/pacientes', icon: '👤', label: 'Pacientes' },
  { to: '/consultas', icon: '📋', label: 'Consultas' },
  { to: '/medicamentos', icon: '💊', label: 'Medicamentos' },
];

export default function Sidebar() {
  const { usuario, logout } = useAuth();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      position: 'fixed', top: 0, left: 0, bottom: 0,
      background: 'var(--primary-dark)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100, boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0
          }}>🏥</div>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>CET</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 500 }}>Clínica Estudiantil</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, padding: '8px 8px 4px' }}>Menú</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8,
              color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              textDecoration: 'none', fontWeight: isActive ? 700 : 500,
              fontSize: 14, transition: 'all 0.15s',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent'
            })}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
            {usuario?.nombre}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{usuario?.rol}</div>
        </div>
        <button
          onClick={logout}
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: 8, color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center' }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
