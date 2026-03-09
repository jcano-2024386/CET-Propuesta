import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const GRADOS = ['Primero Básico', 'Segundo Básico', 'Tercero Básico', 'Cuarto Bachillerato', 'Quinto Bachillerato', 'Sexto Bachillerato', 'Primero Técnico', 'Segundo Técnico', 'Tercero Técnico'];

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [form, setForm] = useState({ codigoAcademico: '', nombre: '', apellido: '', edad: '', grado: '', seccion: '', genero: 'M', telefono: '', telefonoEmergencia: '', alergias: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchPacientes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const r = await api.get('/pacientes', { params: { page, limit: 12, search, activo: true } });
      setPacientes(r.data.data);
      setPagination(r.data.pagination);
    } catch { toast.error('Error cargando pacientes'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchPacientes(1), 300);
    return () => clearTimeout(t);
  }, [fetchPacientes]);

  const openCreate = () => {
    setEditando(null);
    setForm({ codigoAcademico: '', nombre: '', apellido: '', edad: '', grado: '', seccion: '', genero: 'M', telefono: '', telefonoEmergencia: '', alergias: '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditando(p);
    setForm({ codigoAcademico: p.codigoAcademico, nombre: p.nombre, apellido: p.apellido, edad: p.edad, grado: p.grado, seccion: p.seccion || '', genero: p.genero, telefono: p.telefono || '', telefonoEmergencia: p.telefonoEmergencia || '', alergias: p.alergias || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editando) {
        await api.put(`/pacientes/${editando._id}`, form);
        toast.success('Paciente actualizado');
      } else {
        await api.post('/pacientes', form);
        toast.success('Paciente registrado');
      }
      setShowModal(false);
      fetchPacientes(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (p) => {
    if (!confirm(`¿Desactivar a ${p.nombre} ${p.apellido}?`)) return;
    try {
      await api.delete(`/pacientes/${p._id}`);
      toast.success('Paciente desactivado');
      fetchPacientes(1);
    } catch { toast.error('Error'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">👤 Pacientes</h1>
          <p className="page-subtitle">{pagination.total} estudiantes registrados</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Paciente</button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 20 }}>
        <div className="search-bar" style={{ border: 'none', padding: 0 }}>
          <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>🔍</span>
          <input
            placeholder="Buscar por nombre, apellido o código académico..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-center"><div className="spinner spinner-dark"></div></div>
        ) : pacientes.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>👤</div>
            <h3>No se encontraron pacientes</h3>
            <p style={{ marginTop: 8 }}>{search ? 'Intenta con otro término de búsqueda' : 'Registra el primer paciente'}</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre Completo</th>
                    <th>Grado / Sección</th>
                    <th>Edad</th>
                    <th>Género</th>
                    <th>Alergias</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map(p => (
                    <tr key={p._id}>
                      <td><span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{p.codigoAcademico}</span></td>
                      <td><span style={{ fontWeight: 600 }}>{p.nombre} {p.apellido}</span></td>
                      <td>{p.grado} {p.seccion && `"${p.seccion}"`}</td>
                      <td>{p.edad} años</td>
                      <td><span className={`badge ${p.genero === 'M' ? 'badge-blue' : 'badge-red'}`}>{p.genero === 'M' ? '♂ Masculino' : '♀ Femenino'}</span></td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.alergias || 'Ninguna'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/pacientes/${p._id}/historial`)}>📋 Historial</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p)} style={{ color: 'var(--danger)' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination.pages > 1 && (
              <div style={{ padding: '12px 16px', display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)' }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => fetchPacientes(p)}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editando ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Código Académico *</label>
                    <input className="form-control" value={form.codigoAcademico} onChange={e => set('codigoAcademico', e.target.value)} placeholder="2024001" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Edad *</label>
                    <input type="number" className="form-control" value={form.edad} onChange={e => set('edad', e.target.value)} min={5} max={30} required />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input className="form-control" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido *</label>
                    <input className="form-control" value={form.apellido} onChange={e => set('apellido', e.target.value)} required />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Grado *</label>
                    <select className="form-control" value={form.grado} onChange={e => set('grado', e.target.value)} required>
                      <option value="">Seleccionar...</option>
                      {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sección</label>
                    <input className="form-control" value={form.seccion} onChange={e => set('seccion', e.target.value)} placeholder="A, B, C..." maxLength={2} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Género *</label>
                  <select className="form-control" value={form.genero} onChange={e => set('genero', e.target.value)} required>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="5555-5555" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tel. Emergencia</label>
                    <input className="form-control" value={form.telefonoEmergencia} onChange={e => set('telefonoEmergencia', e.target.value)} placeholder="5555-5555" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Alergias Conocidas</label>
                  <input className="form-control" value={form.alergias} onChange={e => set('alergias', e.target.value)} placeholder="Ninguna / Penicilina / ..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" /> Guardando...</> : (editando ? 'Actualizar' : 'Registrar Paciente')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
