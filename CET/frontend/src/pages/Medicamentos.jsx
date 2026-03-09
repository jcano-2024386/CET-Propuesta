import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CATEGORIAS = ['ANALGESICO', 'ANTIBIOTICO', 'ANTIINFLAMATORIO', 'ANTIHISTAMINICO', 'ANTIACIDO', 'VITAMINAS', 'OTRO'];
const UNIDADES = ['PASTILLAS', 'ML', 'SOBRES', 'CAPSULAS', 'AMPOLLAS', 'OTRO'];

const estadoConfig = {
  DISPONIBLE: { label: 'Disponible', badge: 'badge-green' },
  AGOTADO: { label: 'Agotado', badge: 'badge-red' },
  BAJO_STOCK: { label: 'Bajo Stock', badge: 'badge-yellow' },
  POR_VENCER: { label: 'Por Vencer', badge: 'badge-blue' },
};

export default function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [stockMed, setStockMed] = useState(null);
  const [stockForm, setStockForm] = useState({ cantidad: '', tipo: 'ENTRADA' });
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', categoria: 'OTRO', cantidad: '', cantidadMinima: 5,
    unidad: 'PASTILLAS', fechaVencimiento: '', proveedor: ''
  });

  const fetchMed = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/medicamentos', { params: { search } });
      setMedicamentos(r.data.data);
    } catch { toast.error('Error cargando medicamentos'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchMed, 300);
    return () => clearTimeout(t);
  }, [fetchMed]);

  const openCreate = () => {
    setEditando(null);
    setForm({ nombre: '', descripcion: '', categoria: 'OTRO', cantidad: '', cantidadMinima: 5, unidad: 'PASTILLAS', fechaVencimiento: '', proveedor: '' });
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditando(m);
    setForm({
      nombre: m.nombre, descripcion: m.descripcion || '', categoria: m.categoria,
      cantidad: m.cantidad, cantidadMinima: m.cantidadMinima, unidad: m.unidad,
      fechaVencimiento: m.fechaVencimiento?.substring(0, 10) || '', proveedor: m.proveedor || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editando) {
        await api.put(`/medicamentos/${editando._id}`, form);
        toast.success('Medicamento actualizado');
      } else {
        await api.post('/medicamentos', form);
        toast.success('Medicamento registrado');
      }
      setShowModal(false);
      fetchMed();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setSaving(false); }
  };

  const handleStock = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/medicamentos/${stockMed._id}/stock`, stockForm);
      toast.success('Stock actualizado');
      setShowStockModal(false);
      fetchMed();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (m) => {
    if (!confirm(`¿Eliminar ${m.nombre}?`)) return;
    try {
      await api.delete(`/medicamentos/${m._id}`);
      toast.success('Medicamento eliminado');
      fetchMed();
    } catch { toast.error('Error'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">💊 Medicamentos</h1>
          <p className="page-subtitle">{medicamentos.length} medicamentos en inventario</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Medicamento</button>
      </div>

      {/* Resumen rápido */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {Object.entries(estadoConfig).map(([key, cfg]) => {
          const count = medicamentos.filter(m => m.estado === key).length;
          return (
            <div key={key} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{cfg.label}</div>
              <span className={`badge ${cfg.badge}`} style={{ fontSize: 16, fontWeight: 800 }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 20 }}>
        <div className="search-bar" style={{ border: 'none', padding: 0 }}>
          <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>🔍</span>
          <input placeholder="Buscar medicamento..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-center"><div className="spinner spinner-dark"></div></div>
        ) : medicamentos.length === 0 ? (
          <div className="empty-state"><div style={{ fontSize: 48 }}>💊</div><h3>No hay medicamentos</h3></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Stock Mín.</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map(m => {
                  const cfg = estadoConfig[m.estado] || estadoConfig.DISPONIBLE;
                  const venc = new Date(m.fechaVencimiento);
                  const hoy = new Date();
                  const diasVenc = Math.ceil((venc - hoy) / (1000*60*60*24));
                  return (
                    <tr key={m._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{m.nombre}</div>
                        {m.descripcion && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.descripcion}</div>}
                      </td>
                      <td><span className="badge badge-gray">{m.categoria}</span></td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: 16, color: m.cantidad === 0 ? 'var(--danger)' : 'var(--text)' }}>
                          {m.cantidad}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>{m.unidad}</span>
                      </td>
                      <td>{m.cantidadMinima}</td>
                      <td>
                        <div style={{ fontSize: 13 }}>{venc.toLocaleDateString('es-GT')}</div>
                        {diasVenc <= 60 && <div style={{ fontSize: 11, color: diasVenc <= 0 ? 'var(--danger)' : 'var(--warning)' }}>
                          {diasVenc <= 0 ? '¡Vencido!' : `${diasVenc} días`}
                        </div>}
                      </td>
                      <td><span className={`badge ${cfg.badge}`}>{cfg.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setStockMed(m); setStockForm({ cantidad: '', tipo: 'ENTRADA' }); setShowStockModal(true); }}>📦 Stock</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}>✏️</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(m)} style={{ color: 'var(--danger)' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nuevo/Editar */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editando ? 'Editar Medicamento' : 'Nuevo Medicamento'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <input className="form-control" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Categoría *</label>
                    <select className="form-control" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unidad</label>
                    <select className="form-control" value={form.unidad} onChange={e => set('unidad', e.target.value)}>
                      {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Cantidad Actual *</label>
                    <input type="number" className="form-control" value={form.cantidad} onChange={e => set('cantidad', e.target.value)} min={0} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cantidad Mínima</label>
                    <input type="number" className="form-control" value={form.cantidadMinima} onChange={e => set('cantidadMinima', e.target.value)} min={1} />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Fecha Vencimiento *</label>
                    <input type="date" className="form-control" value={form.fechaVencimiento} onChange={e => set('fechaVencimiento', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Proveedor</label>
                    <input className="form-control" value={form.proveedor} onChange={e => set('proveedor', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" /> Guardando...</> : (editando ? 'Actualizar' : 'Registrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajustar Stock */}
      {showStockModal && stockMed && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowStockModal(false)}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2 className="modal-title">📦 Ajustar Stock</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowStockModal(false)}>✕</button>
            </div>
            <form onSubmit={handleStock}>
              <div className="modal-body">
                <div className="alert alert-warning" style={{ marginBottom: 0 }}>
                  <strong>{stockMed.nombre}</strong> — Stock actual: <strong>{stockMed.cantidad} {stockMed.unidad}</strong>
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de Movimiento</label>
                  <select className="form-control" value={stockForm.tipo} onChange={e => setStockForm(f => ({ ...f, tipo: e.target.value }))}>
                    <option value="ENTRADA">📥 Entrada (Agregar)</option>
                    <option value="SALIDA">📤 Salida (Restar)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cantidad *</label>
                  <input type="number" className="form-control" value={stockForm.cantidad} onChange={e => setStockForm(f => ({ ...f, cantidad: Number(e.target.value) }))} min={1} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowStockModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" /> Guardando...</> : 'Actualizar Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
