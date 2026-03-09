import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Búsqueda de paciente
  const [busqueda, setBusqueda] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [buscando, setBuscando] = useState(false);

  // Medicamentos disponibles
  const [medicamentosDisp, setMedicamentosDisp] = useState([]);
  const [medSeleccionados, setMedSeleccionados] = useState([]);

  const [form, setForm] = useState({
    sintomas: '', diagnostico: '', tratamiento: '', observaciones: '',
    seguimientoRequerido: false, estado: 'ACTIVA'
  });

  const fetchConsultas = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const r = await api.get('/consultas', { params: { page, limit: 10 } });
      setConsultas(r.data.data);
      setPagination(r.data.pagination);
    } catch { toast.error('Error cargando consultas'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchConsultas(); }, [fetchConsultas]);

  useEffect(() => {
    api.get('/medicamentos').then(r => setMedicamentosDisp(r.data.data.filter(m => m.cantidad > 0)));
  }, []);

  const buscarPaciente = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    try {
      const r = await api.get(`/pacientes/codigo/${busqueda.trim()}`);
      setPacienteEncontrado(r.data.data);
      toast.success('Paciente encontrado');
    } catch {
      toast.error('Paciente no encontrado. Verifique el código.');
      setPacienteEncontrado(null);
    } finally { setBuscando(false); }
  };

  const agregarMedicamento = () => {
    setMedSeleccionados(prev => [...prev, { medicamento: '', cantidad: 1, dosis: '' }]);
  };

  const quitarMedicamento = (i) => {
    setMedSeleccionados(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateMed = (i, k, v) => {
    setMedSeleccionados(prev => prev.map((m, idx) => idx === i ? { ...m, [k]: v } : m));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pacienteEncontrado) { toast.error('Busca y selecciona un paciente'); return; }
    setSaving(true);
    try {
      const medFiltrados = medSeleccionados.filter(m => m.medicamento);
      await api.post('/consultas', {
        paciente: pacienteEncontrado._id,
        ...form,
        medicamentosSuministrados: medFiltrados
      });
      toast.success('Consulta registrada exitosamente');
      setShowModal(false);
      setBusqueda('');
      setPacienteEncontrado(null);
      setMedSeleccionados([]);
      setForm({ sintomas: '', diagnostico: '', tratamiento: '', observaciones: '', seguimientoRequerido: false, estado: 'ACTIVA' });
      fetchConsultas(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrar consulta');
    } finally { setSaving(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Consultas</h1>
          <p className="page-subtitle">{pagination.total} consultas registradas</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nueva Consulta</button>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-center"><div className="spinner spinner-dark"></div></div>
        ) : consultas.length === 0 ? (
          <div className="empty-state"><div style={{ fontSize: 48 }}>📋</div><h3>Sin consultas registradas</h3></div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Paciente</th>
                    <th>Grado</th>
                    <th>Síntomas</th>
                    <th>Medicamentos</th>
                    <th>Atendido por</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {consultas.map(c => (
                    <tr key={c._id}>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{new Date(c.fechaConsulta).toLocaleDateString('es-GT')}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(c.fechaConsulta).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{c.paciente?.nombre} {c.paciente?.apellido}</div>
                        <div style={{ fontSize: 12, color: 'var(--primary)', fontFamily: 'DM Mono' }}>{c.paciente?.codigoAcademico}</div>
                      </td>
                      <td style={{ fontSize: 13 }}>{c.paciente?.grado}</td>
                      <td style={{ maxWidth: 200 }}>
                        <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.sintomas}</div>
                      </td>
                      <td>
                        {c.medicamentosSuministrados?.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {c.medicamentosSuministrados.map((m, i) => (
                              <span key={i} className="badge badge-blue" style={{ fontSize: 11 }}>{m.nombreMedicamento}</span>
                            ))}
                          </div>
                        ) : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ninguno</span>}
                      </td>
                      <td style={{ fontSize: 13 }}>{c.encargado?.nombre}</td>
                      <td>
                        <span className={`badge ${c.estado === 'ACTIVA' ? 'badge-green' : c.estado === 'SEGUIMIENTO' ? 'badge-yellow' : 'badge-gray'}`}>{c.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination.pages > 1 && (
              <div style={{ padding: '12px 16px', display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)' }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => fetchConsultas(p)}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Nueva Consulta */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <h2 className="modal-title">📋 Nueva Consulta</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Buscar Paciente */}
                <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 10, marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--primary)' }}>🔍 Buscar Paciente por Código Académico</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="form-control"
                      placeholder="Ej: 2024001"
                      value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), buscarPaciente())}
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="btn btn-primary" onClick={buscarPaciente} disabled={buscando}>
                      {buscando ? <span className="spinner" /> : '🔍 Buscar'}
                    </button>
                  </div>
                  {pacienteEncontrado && (
                    <div className="alert alert-success" style={{ marginTop: 10 }}>
                      ✅ <strong>{pacienteEncontrado.nombre} {pacienteEncontrado.apellido}</strong> — {pacienteEncontrado.grado} {pacienteEncontrado.seccion || ''} — Código: {pacienteEncontrado.codigoAcademico}
                      {pacienteEncontrado.alergias && pacienteEncontrado.alergias !== 'Ninguna' && (
                        <div style={{ marginTop: 4, color: 'var(--danger)', fontWeight: 600 }}>⚠️ Alergias: {pacienteEncontrado.alergias}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Síntomas *</label>
                  <textarea className="form-control" rows={2} value={form.sintomas} onChange={e => set('sintomas', e.target.value)} required style={{ resize: 'vertical' }} />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Diagnóstico</label>
                    <input className="form-control" value={form.diagnostico} onChange={e => set('diagnostico', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tratamiento</label>
                    <input className="form-control" value={form.tratamiento} onChange={e => set('tratamiento', e.target.value)} />
                  </div>
                </div>

                {/* Medicamentos */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label className="form-label" style={{ margin: 0 }}>💊 Medicamentos Suministrados</label>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={agregarMedicamento}>+ Agregar</button>
                  </div>
                  {medSeleccionados.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '10px 0' }}>Sin medicamentos. Haz clic en "+ Agregar" para añadir.</div>
                  ) : medSeleccionados.map((m, i) => {
                    const medSel = medicamentosDisp.find(x => x._id === m.medicamento);
                    return (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 2 }}>
                          <label className="form-label">Medicamento</label>
                          <select className="form-control" value={m.medicamento} onChange={e => updateMed(i, 'medicamento', e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {medicamentosDisp.map(med => <option key={med._id} value={med._id}>{med.nombre} ({med.cantidad} disp.)</option>)}
                          </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Cantidad</label>
                          <input type="number" className="form-control" value={m.cantidad}
                            onChange={e => updateMed(i, 'cantidad', Number(e.target.value))}
                            min={1} max={medSel?.cantidad || 999} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Dosis</label>
                          <input className="form-control" value={m.dosis} onChange={e => updateMed(i, 'dosis', e.target.value)} placeholder="1 cada 8h" />
                        </div>
                        <button type="button" className="btn btn-danger btn-icon" onClick={() => quitarMedicamento(i)} style={{ marginBottom: 2 }}>✕</button>
                      </div>
                    );
                  })}
                </div>

                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <textarea className="form-control" rows={2} value={form.observaciones} onChange={e => set('observaciones', e.target.value)} style={{ resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: 20 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Estado</label>
                    <select className="form-control" value={form.estado} onChange={e => set('estado', e.target.value)}>
                      <option value="ACTIVA">Activa</option>
                      <option value="CERRADA">Cerrada</option>
                      <option value="SEGUIMIENTO">Requiere Seguimiento</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ justifyContent: 'flex-end', paddingBottom: 2 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                      <input type="checkbox" checked={form.seguimientoRequerido} onChange={e => set('seguimientoRequerido', e.target.checked)} style={{ width: 16, height: 16 }} />
                      Requiere seguimiento
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving || !pacienteEncontrado}>
                  {saving ? <><span className="spinner" /> Guardando...</> : '✅ Registrar Consulta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
