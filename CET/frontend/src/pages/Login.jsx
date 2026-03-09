import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('¡Bienvenido al sistema CET!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--primary-dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,201,167,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26,109,181,0.3) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'var(--accent)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 36, marginBottom: 16, boxShadow: '0 8px 32px rgba(0,201,167,0.4)'
          }}>🏥</div>
          <h1 style={{ color: 'white', fontSize: 32, fontWeight: 800, marginBottom: 4 }}>CET</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>Clínica Estudiantil Técnica</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 4 }}>Centro Educativo Técnico Laboral Kinal</p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Iniciar Sesión</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                placeholder="usuario@cet.kinal.edu.gt"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 4 }}>
              {loading ? <><span className="spinner" /> Ingresando...</> : 'Ingresar al Sistema'}
            </button>
          </form>

          <div className="alert alert-warning" style={{ marginTop: 24, fontSize: 13 }}>
            <strong>Demo:</strong> admin@cet.kinal.edu.gt / Admin2025!
          </div>
        </div>
      </div>
    </div>
  );
}
